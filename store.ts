import { create } from 'zustand';
import { fetchComments } from './services/youtubeService';
import { categorizeComments } from './services/geminiService';
import type { Category, AnalysisStats, ProgressUpdate, Comment, AppError } from './types';

declare const chrome: any;

type NotificationPermission = 'default' | 'granted' | 'denied';

const initialState = {
  maxComments: 5000,
  analysisPhase: 'idle' as 'idle' | 'fetching' | 'analyzing',
  error: null as AppError | null,
  categories: [] as Category[],
  progress: null as ProgressUpdate | null,
  analysisStats: null as AnalysisStats | null,
  isPricingModalOpen: false,
  notificationPermission: 'default' as NotificationPermission,
};

type AppState = typeof initialState & {
  setMaxComments: (limit: number) => void;
  setIsPricingModalOpen: (isOpen: boolean) => void;
  checkNotificationPermission: () => void;
  addReply: (categoryTitle: string, path: number[], newReplyText: string) => void;
  analyze: (videoId: string) => Promise<void>;
  reset: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setMaxComments: (limit) => set({ maxComments: limit }),
  setIsPricingModalOpen: (isOpen) => set({ isPricingModalOpen: isOpen }),

  checkNotificationPermission: () => {
    if ('Notification' in window) {
      set({ notificationPermission: Notification.permission as NotificationPermission });
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
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push({
          id: `reply-${Date.now()}`,
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

  reset: () => {
    set(initialState);
  },

  analyze: async (videoId: string) => {
    const { maxComments } = get();

    set({
      analysisPhase: 'fetching',
      error: null,
      categories: [],
      progress: null,
      analysisStats: null,
    });

    try {
      const storedKeys = await chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey']);
      const { youtubeApiKey, geminiApiKey } = storedKeys;

      if (!youtubeApiKey) {
        throw new Error('YOUTUBE_INVALID_KEY');
      }
      if (!geminiApiKey) {
        throw new Error('GEMINI_INVALID_KEY');
      }

      const fetchedComments = await fetchComments(videoId, youtubeApiKey, maxComments);
      
      set({ analysisPhase: 'analyzing' });
      const targetLanguage = navigator.language || 'en';

      const handleUpdate = (newBatchCategories: Category[], prog: ProgressUpdate) => {
        set(state => {
            const categoriesMap = new Map<string, Category>();
            state.categories.forEach(cat => categoriesMap.set(cat.categoryTitle, cat));
            
            newBatchCategories.forEach(newCat => {
                if (!newCat || !newCat.categoryTitle || !Array.isArray(newCat.comments)) return;
                const incomingComments = newCat.comments.filter(c => c && c.id && c.author && c.text);
                if (categoriesMap.has(newCat.categoryTitle)) {
                    const existingCat = categoriesMap.get(newCat.categoryTitle)!;
                    const existingCommentIds = new Set(existingCat.comments.map(c => c.id));
                    const newUniqueComments = incomingComments.filter(nc => !existingCommentIds.has(nc.id));
                    if (newUniqueComments.length > 0) {
                      existingCat.comments.push(...newUniqueComments);
                    }
                } else {
                    categoriesMap.set(newCat.categoryTitle, {
                        ...newCat,
                        id: `cat-${Date.now()}-${Math.random()}`,
                        comments: incomingComments,
                    });
                }
            });
            const sortedCategories = Array.from(categoriesMap.values()).sort((a,b) => b.comments.length - a.comments.length);
            return { categories: sortedCategories, progress: prog };
        });
      };

      const finalStats = await categorizeComments(fetchedComments, targetLanguage, handleUpdate, geminiApiKey);
      
      set({ analysisStats: finalStats });

    } catch (e) {
      console.error(e);
      let errorCode = 'UNKNOWN_ERROR';
      let userFriendlyMessage = 'An unknown error occurred.';
      if (e instanceof Error) {
          errorCode = e.message;
          switch (e.message) {
              case 'YOUTUBE_QUOTA_EXCEEDED':
                  userFriendlyMessage = 'YouTube API Quota Exceeded. Please try again tomorrow.';
                  break;
              case 'YOUTUBE_VIDEO_NOT_FOUND':
                  userFriendlyMessage = 'The YouTube video was not found.';
                  break;
              case 'YOUTUBE_COMMENTS_DISABLED':
                  userFriendlyMessage = 'Comments are disabled for this YouTube video.';
                  break;
              case 'YOUTUBE_INVALID_KEY':
                  userFriendlyMessage = 'YouTube API key is missing or invalid. Please set it in the extension options.';
                  break;
              case 'GEMINI_INVALID_KEY':
                  userFriendlyMessage = 'Gemini API key is missing or invalid. Please set it in the extension options.';
                  break;
              default:
                  userFriendlyMessage = e.message;
                  break;
          }
      }
      set({ error: { code: errorCode, message: userFriendlyMessage } });
    } finally {
      set({ analysisPhase: 'idle', progress: null });
      if (get().notificationPermission === 'granted') {
          new Notification('Comment Analysis Complete!', {
              body: `Finished analyzing comments. Click the extension icon to see results.`,
              icon: chrome.runtime.getURL('icons/icon48.png'), 
          });
      }
    }
  }
}));
