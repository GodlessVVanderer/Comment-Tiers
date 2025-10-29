
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AnalysisStats, Category, Comment, ProgressUpdate } from './types';
import { fetchComments } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import { NGRAM_SIZE, NGRAM_SPAM_THRESHOLD, MIN_WORD_COUNT, COMMENT_LIMIT_OPTIONS } from './constants';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

type AppStatus = 'idle' | 'configuring' | 'fetching' | 'preprocessing' | 'analyzing' | 'complete' | 'error';

interface AppState {
  youtubeApiKey: string;
  geminiApiKey: string;
  keysLoaded: boolean;
  status: AppStatus;
  error: string | null;
  stats: AnalysisStats;
  progress: ProgressUpdate;
  categories: Category[];
  commentLimit: number;
}

interface AppActions {
  initialize: () => void;
  setCommentLimit: (limit: number) => void;
  analyze: (videoId: string) => Promise<void>;
  reset: () => void;
  addCommentToCategory: (categoryTitle: string, comment: Comment) => void;
  addReplyToComment: (categoryTitle: string, path: number[], reply: Comment) => void;
  editCommentInCategory: (categoryTitle: string, path: number[], newText: string) => void;
}

const initialState: AppState = {
  youtubeApiKey: '',
  geminiApiKey: '',
  keysLoaded: false,
  status: 'idle',
  error: null,
  stats: { total: 0, filtered: 0, analyzed: 0 },
  progress: { processed: 0, total: 0, currentBatch: 0, totalBatches: 0, etaSeconds: null },
  categories: [],
  commentLimit: COMMENT_LIMIT_OPTIONS[0],
};

export const useAppStore = create<AppState & AppActions>()(
  immer((set, get) => ({
    ...initialState,

    initialize: () => {
      chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], (result: { youtubeApiKey?: string; geminiApiKey?: string }) => {
        const { youtubeApiKey, geminiApiKey } = result;
        set(state => {
          state.youtubeApiKey = youtubeApiKey || '';
          state.geminiApiKey = geminiApiKey || '';
          state.keysLoaded = true;
          if (!youtubeApiKey || !geminiApiKey) {
            state.status = 'configuring';
          } else {
            // If we were in a "needs keys" or error state, go back to idle.
            if (get().status === 'configuring' || get().status === 'error') {
               state.status = 'idle';
               state.error = null;
            }
          }
        });
      });
    },

    setCommentLimit: (limit: number) => {
      set(state => {
        state.commentLimit = limit;
      });
    },

    reset: () => {
        set(state => {
            const { youtubeApiKey, geminiApiKey, keysLoaded } = state;
            Object.assign(state, initialState);
            state.youtubeApiKey = youtubeApiKey;
            state.geminiApiKey = geminiApiKey;
            state.keysLoaded = keysLoaded;
        });
    },

    analyze: async (videoId: string) => {
      const { youtubeApiKey, geminiApiKey, commentLimit } = get();

      if (!youtubeApiKey || !geminiApiKey) {
        set({ status: 'configuring', error: "API keys are not set. Please set them in the extension options." });
        return;
      }
      
      set({ status: 'fetching', error: null, progress: initialState.progress, stats: initialState.stats, categories: [] });

      try {
        // 1. Fetch comments
        const allComments = await fetchComments(videoId, youtubeApiKey, commentLimit);
        set(state => {
          state.stats.total = allComments.length;
        });

        if (allComments.length === 0) {
          set({ status: 'complete', error: null, stats: { total: 0, filtered: 0, analyzed: 0 } });
          return;
        }

        // 2. Prefilter comments in background script
        set({ status: 'preprocessing' });
        const filteredComments: Comment[] = await new Promise((resolve) => {
            chrome.runtime.sendMessage(
                {
                    action: 'prefilter-comments',
                    payload: {
                        comments: allComments,
                        minWordCount: MIN_WORD_COUNT,
                        ngramSize: NGRAM_SIZE,
                        spamThreshold: NGRAM_SPAM_THRESHOLD,
                    },
                },
                (response: Comment[]) => {
                    resolve(response || []); // Ensure we resolve with an array even if something fails
                }
            );
        });
        
        const filteredCount = allComments.length - filteredComments.length;
        set(state => {
          state.stats.filtered = filteredCount;
          state.stats.analyzed = filteredComments.length;
        });
        
        if (filteredComments.length === 0) {
            set({ status: 'complete', error: "No suitable comments for analysis after filtering noise."});
            return;
        }

        // 3. Analyze comments
        set({ status: 'analyzing' });
        const categories = await analyzeComments(
          filteredComments,
          geminiApiKey,
          (progressUpdate) => {
            set(state => {
              state.progress = progressUpdate;
            });
          }
        );

        set({ status: 'complete', categories: categories.sort((a, b) => b.comments.length - a.comments.length) });

      } catch (e: any) {
        console.error("Analysis failed:", e);
        let errorMessage = "An unknown error occurred during analysis.";
        if (e instanceof Error) {
            switch(e.message) {
                case 'YOUTUBE_QUOTA_EXCEEDED':
                    errorMessage = 'YouTube API daily quota exceeded. Please try again tomorrow or use a different key.';
                    break;
                case 'YOUTUBE_VIDEO_NOT_FOUND':
                    errorMessage = 'The video could not be found.';
                    break;
                case 'YOUTUBE_COMMENTS_DISABLED':
                    errorMessage = 'Comments are disabled for this video.';
                    break;
                case 'YOUTUBE_INVALID_KEY':
                    errorMessage = 'Your YouTube API key is invalid. Please check it in the extension options.';
                    break;
                case 'GEMINI_INVALID_KEY':
                    errorMessage = 'Your Gemini API key is invalid or missing. Please check it in the extension options.';
                    break;
                default:
                    if (e.message.startsWith('Gemini API Error:')) {
                        errorMessage = e.message;
                    } else if (e.message.startsWith('YouTube API Error:')) {
                        errorMessage = e.message;
                    } else {
                        errorMessage = e.message;
                    }
            }
        }
        set({ status: 'error', error: errorMessage });
      }
    },

    addCommentToCategory: (categoryTitle: string, comment: Comment) => {
        set(state => {
            const category = state.categories.find(c => c.categoryTitle === categoryTitle);
            if (category) {
                category.comments.unshift(comment);
            }
        });
    },

    addReplyToComment: (categoryTitle: string, path: number[], reply: Comment) => {
        set(state => {
            const category = state.categories.find(c => c.categoryTitle === categoryTitle);
            if (!category) return;

            let parent: Comment | undefined = category.comments[path[0]];
            for (let i = 1; i < path.length; i++) {
                if (!parent || !parent.replies) return;
                parent = parent.replies[path[i]];
            }

            if (parent) {
                if (!parent.replies) {
                    parent.replies = [];
                }
                parent.replies.unshift(reply);
            }
        });
    },

    editCommentInCategory: (categoryTitle: string, path: number[], newText: string) => {
        set(state => {
            const category = state.categories.find(c => c.categoryTitle === categoryTitle);
            if (!category) return;
            
            let commentToEdit: Comment | undefined = category.comments[path[0]];
            // Traverse to find the exact comment/reply
            for (let i = 1; i < path.length; i++) {
                if (!commentToEdit || !commentToEdit.replies) return;
                commentToEdit = commentToEdit.replies[path[i]];
            }

            if (commentToEdit) {
                commentToEdit.text = newText;
            }
        });
    },
  }))
);
