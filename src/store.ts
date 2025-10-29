import { create } from 'zustand';
import type { Category, Comment, AnalysisStats, ProgressUpdate } from './types';
import { fetchComments } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import { MIN_WORD_COUNT, NGRAM_SIZE, NGRAM_SPAM_THRESHOLD } from './constants';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

type Status = 'idle' | 'configuring' | 'fetching' | 'preprocessing' | 'analyzing' | 'complete' | 'error';

interface AppState {
  // State
  status: Status;
  error: string | null;
  stats: AnalysisStats;
  progress: ProgressUpdate;
  categories: Category[];
  keysLoaded: boolean;
  commentLimit: number;
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  
  // Actions
  initialize: () => void;
  analyze: (videoId: string) => Promise<void>;
  setCommentLimit: (limit: number) => void;
  addCommentToCategory: (categoryTitle: string, comment: Comment) => void;
  addReplyToComment: (categoryTitle:string, path: number[], reply: Comment) => void;
  editCommentInCategory: (categoryTitle: string, path: number[], newText: string) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as Status,
  error: null,
  stats: { total: 0, filtered: 0, analyzed: 0 },
  progress: { processed: 0, total: 0, currentBatch: 0, totalBatches: 0, etaSeconds: null },
  categories: [],
  keysLoaded: false,
  commentLimit: 1000,
  youtubeApiKey: null,
  geminiApiKey: null,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  
  initialize: () => {
    chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], (result) => {
      const { youtubeApiKey, geminiApiKey } = result;
      set({
        youtubeApiKey,
        geminiApiKey,
        keysLoaded: true,
        status: (youtubeApiKey && geminiApiKey) ? 'idle' : 'configuring',
      });
    });
  },
  
  analyze: async (videoId: string) => {
    const { youtubeApiKey, geminiApiKey, commentLimit } = get();

    if (!youtubeApiKey || !geminiApiKey) {
      set({ status: 'error', error: 'API keys are not configured.' });
      return;
    }

    set({ ...initialState, status: 'fetching', keysLoaded: true, youtubeApiKey, geminiApiKey, commentLimit });

    try {
      // 1. Fetch Comments
      const rawComments = await fetchComments(videoId, youtubeApiKey, commentLimit);
      set(state => ({ stats: { ...state.stats, total: rawComments.length }}));

      // 2. Pre-process comments in the background script for performance
      set({ status: 'preprocessing' });
      const prefilterRequest = { 
        action: 'prefilter-comments',
        payload: {
          comments: rawComments,
          minWordCount: MIN_WORD_COUNT,
          ngramSize: NGRAM_SIZE,
          spamThreshold: NGRAM_SPAM_THRESHOLD,
        }
      };

      const filteredComments: Comment[] = await chrome.runtime.sendMessage(prefilterRequest);
      
      set(state => ({ 
          stats: { ...state.stats, filtered: rawComments.length - filteredComments.length, analyzed: filteredComments.length },
      }));
      
      if (filteredComments.length === 0) {
        set({ status: 'complete', categories: [] });
        return;
      }

      // 3. Analyze comments
      set({ status: 'analyzing' });
      const categories = await analyzeComments(
        filteredComments,
        geminiApiKey,
        (progressUpdate) => {
          set({ progress: progressUpdate });
        }
      );

      // 4. Analysis complete
      set({ status: 'complete', categories });

      // 5. Send notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon128.png',
        title: 'Analysis Complete',
        message: `Finished analyzing comments for video ID: ${videoId}.`,
      });

    } catch (error: any) {
      console.error("Analysis failed:", error);
      let errorMessage = error.message || 'An unknown error occurred.';
      if (errorMessage.includes('YOUTUBE')) {
        errorMessage = `YouTube API Error: ${errorMessage.split('_').slice(1).join(' ').toLowerCase()}`;
      } else if (errorMessage.includes('GEMINI')) {
        errorMessage = `Gemini API Error: ${errorMessage.split('_').slice(1).join(' ').toLowerCase()}`;
      }
      set({ status: 'error', error: errorMessage });
    }
  },

  setCommentLimit: (limit) => set({ commentLimit: limit }),
  
  addCommentToCategory: (categoryTitle, comment) => {
    set(state => ({
      categories: state.categories.map(cat => 
        cat.categoryTitle === categoryTitle 
          ? { ...cat, comments: [comment, ...cat.comments] } 
          : cat
      )
    }));
  },
  
  addReplyToComment: (categoryTitle, path, reply) => {
    set(state => {
      const newCategories = state.categories.map(cat => ({ ...cat }));
      const category = newCategories.find(c => c.categoryTitle === categoryTitle);
      if (!category) return state;

      let currentLevel: Comment[] = category.comments;
      let parentComment: Comment | null = null;
      for (let i = 0; i < path.length; i++) {
        if (!currentLevel?.[path[i]]) return state; // Invalid path
        if (i === path.length - 1) {
          parentComment = currentLevel[path[i]];
        } else {
          const nextLevel = currentLevel[path[i]].replies;
          if (!nextLevel) return state; // Invalid path
          currentLevel = nextLevel;
        }
      }

      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies = [reply, ...parentComment.replies];
      }
      
      return { categories: newCategories };
    });
  },

  editCommentInCategory: (categoryTitle, path, newText) => {
    set(state => {
      const newCategories = state.categories.map(cat => ({ ...cat }));
      const category = newCategories.find(c => c.categoryTitle === categoryTitle);
      if (!category) return state;

      let currentLevel: Comment[] = category.comments;
      let targetComment: Comment | null = null;
      for (let i = 0; i < path.length; i++) {
        if (!currentLevel?.[path[i]]) return state; // path is invalid
        if (i === path.length - 1) {
          targetComment = currentLevel[path[i]];
        } else {
          const nextLevel = currentLevel[path[i]].replies;
          if (!nextLevel) return state; // invalid path
          currentLevel = nextLevel;
        }
      }
      if (targetComment) {
        targetComment.text = newText;
      }
      return { categories: newCategories };
    });
  },
  
  reset: () => {
    const { keysLoaded, youtubeApiKey, geminiApiKey } = get();
    set({
      ...initialState,
      keysLoaded,
      youtubeApiKey,
      geminiApiKey,
      status: (youtubeApiKey && geminiApiKey) ? 'idle' : 'configuring'
    });
  }
}));