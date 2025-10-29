import { create } from 'zustand';
import type { Category, AnalysisStats, ProgressUpdate, Comment } from './types';
import { fetchComments } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import { MIN_WORD_COUNT, NGRAM_SIZE, NGRAM_SPAM_THRESHOLD } from './constants';

declare const chrome: any;

type AppStatus = 'idle' | 'configuring' | 'fetching' | 'filtering' | 'analyzing' | 'success' | 'error';

interface AppState {
  youtubeApiKey: string;
  geminiApiKey: string;
  status: AppStatus;
  error: string | null;
  configError: string | null;
  categories: Category[];
  stats: AnalysisStats | null;
  progress: ProgressUpdate | null;
  currentTask: string;
  
  initialize: () => void;
  analyze: (videoId: string, commentLimit: number) => Promise<void>;
  addReply: (categoryIndex: number, path: number[], newReplyText: string) => void;
  editComment: (categoryIndex: number, path: number[], newText: string) => void;
  openOptionsPage: () => void;
}

const ERROR_MAP: { [key: string]: string } = {
    'YOUTUBE_QUOTA_EXCEEDED': "YouTube API quota exceeded. Please try again later or use a different key.",
    'YOUTUBE_INVALID_KEY': "Invalid YouTube API key. Please check it in the options page.",
    'YOUTUBE_COMMENTS_DISABLED': "Comments are disabled for this video.",
    'GEMINI_INVALID_KEY': "Invalid Gemini API key. Please check it in the options page.",
};

export const useAppStore = create<AppState>((set, get) => ({
  youtubeApiKey: '',
  geminiApiKey: '',
  status: 'idle',
  error: null,
  configError: null,
  categories: [],
  stats: null,
  progress: null,
  currentTask: '',

  initialize: () => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], (result) => {
        const { youtubeApiKey, geminiApiKey } = result;
        set({ youtubeApiKey: youtubeApiKey || '', geminiApiKey: geminiApiKey || '' });

        if (!youtubeApiKey && !geminiApiKey) {
            set({ status: 'configuring', configError: 'Both API keys are missing.' });
        } else if (!youtubeApiKey) {
            set({ status: 'configuring', configError: 'The YouTube API key is missing.' });
        } else if (!geminiApiKey) {
            set({ status: 'configuring', configError: 'The Gemini API key is missing.' });
        } else {
            set({ status: 'idle', configError: null });
        }
      });

      const handleMessage = (message: { action: string }) => {
        if (message.action === 'keys-updated') {
          get().initialize();
        }
      };
      chrome.runtime.onMessage.addListener(handleMessage);
    }
  },

  analyze: async (videoId: string, commentLimit: number) => {
    set({
      status: 'fetching',
      error: null,
      categories: [],
      stats: null,
      progress: null,
      currentTask: `Fetching up to ${commentLimit.toLocaleString()} comments...`,
    });

    const { youtubeApiKey, geminiApiKey } = get();
    if (!youtubeApiKey || !geminiApiKey) {
      set({ status: 'error', error: 'API keys not found. Please configure them in the options.' });
      return;
    }

    try {
      const fetchedComments = await fetchComments(videoId, youtubeApiKey, commentLimit);
      if (fetchedComments.length === 0) {
        set({ status: 'error', error: "No comments found or comments are disabled for this video." });
        return;
      }
      
      set({ status: 'filtering', currentTask: 'Filtering out noise and spam...' });
      const commentsToFilter = fetchedComments.map(({ id, text }) => ({ id, text }));

      const prefilteredComments: Comment[] = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          { 
            action: 'prefilter-comments', 
            payload: {
              comments: commentsToFilter,
              minWordCount: MIN_WORD_COUNT,
              ngramSize: NGRAM_SIZE,
              spamThreshold: NGRAM_SPAM_THRESHOLD,
            }
          },
          (response: { id: string }[]) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              const filteredIds = new Set(response.map(c => c.id));
              resolve(fetchedComments.filter(c => filteredIds.has(c.id)));
            }
          }
        );
      });

      set({ 
        stats: {
          total: fetchedComments.length,
          filtered: fetchedComments.length - prefilteredComments.length,
          analyzed: prefilteredComments.length,
        } 
      });

      if (prefilteredComments.length === 0) {
        set({ status: 'error', error: "No comments left to analyze after filtering. Try increasing the comment limit." });
        return;
      }
      
      set({ status: 'analyzing', currentTask: 'Analyzing comments with Gemini...' });
      const analysisResults = await analyzeComments(
        prefilteredComments,
        geminiApiKey,
        (update) => set({ progress: update })
      );
      
      analysisResults.sort((a, b) => b.comments.length - a.comments.length);
      set({ categories: analysisResults, status: 'success' });
      
      chrome.notifications?.create({
          type: 'basic',
          iconUrl: 'assets/icon128.png',
          title: 'Analysis Complete',
          message: `Successfully analyzed ${prefilteredComments.length} comments!`,
      });

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        const friendlyMessage = ERROR_MAP[errorMessage] || errorMessage;
        set({ status: 'error', error: friendlyMessage });
        console.error(e);
    } finally {
      set({ currentTask: '', progress: null });
    }
  },

  addReply: (categoryIndex, path, newReplyText) => {
    set(state => {
        const newCategories = JSON.parse(JSON.stringify(state.categories));
        let commentRef = newCategories[categoryIndex].comments;
        
        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                if (!commentRef[path[i]].replies) {
                    commentRef[path[i]].replies = [];
                }
                commentRef[path[i]].replies.unshift({
                    id: `new-reply-${Date.now()}`,
                    author: 'You (Draft)',
                    text: newReplyText,
                    isEditable: true,
                    timestamp: Date.now(),
                });
            } else {
                commentRef = commentRef[path[i]].replies;
            }
        }
        return { categories: newCategories };
    });
  },

  editComment: (categoryIndex, path, newText) => {
    set(state => {
        const newCategories = JSON.parse(JSON.stringify(state.categories));
        let commentRef = newCategories[categoryIndex].comments;

        for (let i = 0; i < path.length; i++) {
            if (i === path.length - 1) {
                commentRef[path[i]].text = newText;
            } else {
                commentRef = commentRef[path[i]].replies;
            }
        }
        return { categories: newCategories };
    });
  },

  openOptionsPage: () => {
    chrome.runtime.sendMessage({ action: 'open-options-page' });
  },
}));