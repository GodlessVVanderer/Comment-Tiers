
import { create } from 'zustand';
import { fetchComments } from './services/youtubeService';
import { categorizeComments } from './services/geminiService';
import type { Category, AnalysisStats, ProgressUpdate, Comment, AppError } from './types';
import { extractVideoId } from './utils';

type NotificationPermission = 'default' | 'granted' | 'denied';

type AppState = {
  youtubeUrl: string;
  youtubeApiKey: string;
  maxComments: number;
  analysisPhase: 'idle' | 'fetching' | 'analyzing';
  error: AppError | null;
  categories: Category[];
  progress: ProgressUpdate | null;
  analysisStats: AnalysisStats | null;
  isHelpModalOpen: boolean;
  isPricingModalOpen: boolean;
  notificationPermission: NotificationPermission;

  // Actions
  setYoutubeUrl: (url: string) => void;
  setYoutubeApiKey: (key: string) => void;
  setMaxComments: (limit: number) => void;
  setIsHelpModalOpen: (isOpen: boolean) => void;
  setIsPricingModalOpen: (isOpen: boolean) => void;
  
  checkNotificationPermission: () => void;
  requestNotificationPermission: () => void;
  
  addReply: (categoryTitle: string, path: number[], newReplyText: string) => void;
  
  analyze: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  youtubeUrl: '',
  youtubeApiKey: '',
  maxComments: 5000,
  analysisPhase: 'idle',
  error: null,
  categories: [],
  progress: null,
  analysisStats: null,
  isHelpModalOpen: false,
  isPricingModalOpen: false,
  notificationPermission: 'default',

  // --- ACTIONS ---
  setYoutubeUrl: (url) => set({ youtubeUrl: url }),
  setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
  setMaxComments: (limit) => set({ maxComments: limit }),
  setIsHelpModalOpen: (isOpen) => set({ isHelpModalOpen: isOpen }),
  setIsPricingModalOpen: (isOpen) => set({ isPricingModalOpen: isOpen }),

  checkNotificationPermission: () => {
    if ('Notification' in window) {
      set({ notificationPermission: Notification.permission as NotificationPermission });
    }
  },

  requestNotificationPermission: () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        set({ notificationPermission: permission as NotificationPermission });
      });
    }
  },
  
  addReply: (categoryTitle, path, newReplyText) => {
    set(state => {
      const newCategories = JSON.parse(JSON.stringify(state.categories));
      
      const categoryIndex = newCategories.findIndex((c: Category) => c.categoryTitle === categoryTitle);
      if (categoryIndex === -1) return { categories: state.categories };

      let parentComment: { replies?: Comment[] } = { replies: newCategories[categoryIndex].comments };
      
      try {
        path.forEach(index => {
          parentComment = parentComment.replies![index];
        });
        if (!parentComment.replies) {
          parentComment.replies = [];
        }
        parentComment.replies.push({
          id: `reply-${Date.now()}-${Math.random()}`,
          author: 'You',
          text: newReplyText
        });
      } catch (e) {
        console.error("Failed to add reply at path:", path, e);
        return { categories: state.categories }; 
      }
      
      return { categories: newCategories };
    });
  },

  analyze: async () => {
    const { youtubeApiKey, youtubeUrl, maxComments } = get();

    if (!youtubeApiKey.trim()) {
      set({ error: { code: 'MISSING_KEY', message: 'Please enter your YouTube API key.' } });
      return;
    }
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      set({ error: { code: 'INVALID_URL', message: 'Please enter a valid YouTube video URL.' } });
      return;
    }

    set({
      analysisPhase: 'fetching',
      error: null,
      categories: [],
      progress: null,
      analysisStats: null,
    });

    try {
      const fetchedComments = await fetchComments(videoId, youtubeApiKey, maxComments);
      
      set({ analysisPhase: 'analyzing' });
      const targetLanguage = navigator.language || 'en';

      const handleUpdate = (newBatchCategories: Category[], prog: ProgressUpdate) => {
        set(state => {
            const categoriesMap = new Map<string, Category>();
            state.categories.forEach(cat => categoriesMap.set(cat.categoryTitle, cat));
            
            newBatchCategories.forEach(newCat => {
                if (!newCat || typeof newCat.categoryTitle !== 'string' || !Array.isArray(newCat.comments)) {
                    return; 
                }
                const incomingComments = newCat.comments.filter(c => c && c.id && typeof c.author === 'string' && typeof c.text === 'string');
                if (categoriesMap.has(newCat.categoryTitle)) {
                    const existingCat = categoriesMap.get(newCat.categoryTitle)!;
                    const existingCommentIds = new Set(existingCat.comments.map(c => c.id));
                    const newUniqueComments = incomingComments.filter(nc => !existingCommentIds.has(nc.id));
                    if (newUniqueComments.length > 0) {
                      const updatedCategory = { ...existingCat, comments: [...existingCat.comments, ...newUniqueComments] };
                      categoriesMap.set(newCat.categoryTitle, updatedCategory);
                    }
                } else {
                    categoriesMap.set(newCat.categoryTitle, {
                        ...newCat,
                        id: `cat-${newCat.categoryTitle.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`,
                        comments: incomingComments,
                    });
                }
            });
            const sortedCategories = Array.from(categoriesMap.values()).sort((a,b) => b.comments.length - a.comments.length);
            return { categories: sortedCategories, progress: prog };
        });
      };

      const finalStats = await categorizeComments(fetchedComments, targetLanguage, handleUpdate);
      
      set({ analysisStats: finalStats });

    } catch (e) {
      console.error(e);
      let errorCode = 'UNKNOWN_ERROR';
      let userFriendlyMessage = 'An unknown error occurred.';
      if (e instanceof Error) {
          errorCode = e.message; // Use the raw error message (e.g., 'YOUTUBE_INVALID_KEY') as the code
          switch (e.message) {
              case 'YOUTUBE_QUOTA_EXCEEDED':
                  userFriendlyMessage = 'YouTube API Quota Exceeded. Please try again tomorrow or use a different API key.';
                  break;
              case 'YOUTUBE_VIDEO_NOT_FOUND':
                  userFriendlyMessage = 'The YouTube video was not found. Please check the URL and try again.';
                  break;
              case 'YOUTUBE_COMMENTS_DISABLED':
                  userFriendlyMessage = 'Comments are disabled for this YouTube video.';
                  break;
              case 'YOUTUBE_INVALID_KEY':
                  userFriendlyMessage = 'The provided YouTube API key is invalid or restricted. Please check the key in your Google Cloud Console.';
                  break;
              case 'YOUTUBE_FORBIDDEN':
                  userFriendlyMessage = 'Could not access comments for this video. This may be due to permission issues or API key restrictions.';
                  break;
              default:
                  userFriendlyMessage = e.message;
                  break;
          }
      }
      set({ error: { code: errorCode, message: `Failed to analyze comments. ${userFriendlyMessage}` } });
    } finally {
      set({ analysisPhase: 'idle', progress: null });
      if (get().notificationPermission === 'granted') {
          new Notification('Comment Analysis Complete!', {
              body: `Finished analyzing comments for the video. Click to see the results.`,
              icon: '/vite.svg', 
          });
      }
    }
  }
}));
