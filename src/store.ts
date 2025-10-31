/// <reference types="chrome" />
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppStatus, AnalysisResults, ProgressUpdate, AppError, Comment, Category, LiveSessionState, TranscriptionTurn } from './types';
import { fetchComments, fetchReplies } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import * as liveService from './services/liveService';
// FIX: The 'LiveSession' type is not exported from '@google/genai' and was not used in this file.
import { LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData } from './audioUtils';

interface AppState {
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  videoId: string | null;
  status: AppStatus;
  configError: string | null;
  error: AppError | null;
  results: AnalysisResults | null;
  progress: ProgressUpdate;
  commentLimit: number;
  isHelpModalOpen: boolean;
  isGeminiHelpModalOpen: boolean;
  isPricingModalOpen: boolean;
  liveSession: LiveSessionState;
  actions: {
    setYoutubeApiKey: (key: string) => void;
    setGeminiApiKey: (key: string) => void;
    setVideoId: (id: string) => void;
    setCommentLimit: (limit: number) => void;
    checkConfig: () => void;
    analyze: () => Promise<void>;
    reset: () => void;
    toggleHelpModal: () => void;
    toggleGeminiHelpModal: () => void;
    togglePricingModal: () => void;
    addReply: (category: string, commentId: string, text: string) => void;
    editComment: (category: string, commentId: string, text: string, replyId?: string) => void;
    loadMoreReplies: (category: string, commentId: string) => void;
    startLiveSession: () => void;
    stopLiveSession: () => void;
  };
}

const initialState = {
  status: 'idle' as AppStatus,
  configError: null,
  error: null,
  results: null,
  videoId: null,
  // FIX: Use 'as const' to ensure the type of 'phase' is inferred as the literal 'fetching', not the wider 'string' type, to match 'LoadingPhase'.
  progress: { phase: 'fetching' as const, percent: 0 },
  commentLimit: 2000,
  isHelpModalOpen: false,
  isGeminiHelpModalOpen: false,
  isPricingModalOpen: false,
  liveSession: {
    status: 'idle' as const,
    transcription: [],
    error: null,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      youtubeApiKey: null,
      geminiApiKey: null,
      ...initialState,
      actions: {
        setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
        setGeminiApiKey: (key) => set({ geminiApiKey: key }),
        setVideoId: (id) => set({ videoId: id }),
        setCommentLimit: (limit) => set({ commentLimit: limit }),
        toggleHelpModal: () => set(state => ({ isHelpModalOpen: !state.isHelpModalOpen })),
        toggleGeminiHelpModal: () => set(state => ({ isGeminiHelpModalOpen: !state.isGeminiHelpModalOpen })),
        togglePricingModal: () => set(state => ({ isPricingModalOpen: !state.isPricingModalOpen })),
        checkConfig: () => {
          const { youtubeApiKey, geminiApiKey } = get();
          if (!youtubeApiKey || !geminiApiKey) {
            set({ status: 'configuring', configError: 'Please set your YouTube and Gemini API keys in the extension options.' });
          } else {
            set({ status: 'idle', configError: null });
          }
        },
        analyze: async () => {
          const { videoId, youtubeApiKey, geminiApiKey, commentLimit } = get();
          if (!videoId || !youtubeApiKey || !geminiApiKey) {
            set({ status: 'error', error: { code: 'CONFIG_MISSING', message: 'API Keys or Video ID are missing.' } });
            return;
          }

          set({ status: 'loading', progress: { phase: 'fetching', percent: 0, processed: 0, total: commentLimit }, error: null });

          try {
            const startTime = Date.now();
            const comments = await fetchComments(videoId, youtubeApiKey, commentLimit, (fetched) => {
              const percent = Math.min(99, Math.round((fetched / commentLimit) * 100));
              set({ progress: { phase: 'fetching', percent, processed: fetched, total: commentLimit } });
            });

            // Basic filtering
            const filteredComments = comments.filter(c => c.text.length > 10 && c.likeCount > 0);

            set({ status: 'summarizing', progress: { phase: 'analyzing', percent: 0 } });
            
            const categories = await analyzeComments(filteredComments, geminiApiKey, (processed, total) => {
                 const percent = Math.min(99, Math.round((processed / total) * 100));
                 set({ progress: { phase: 'analyzing', percent, processed, total }});
            });

            const totalComments = comments.length;
            const analyzedComments = categories.reduce((sum, cat) => sum + cat.comments.length, 0);

            set({
              status: 'success',
              results: {
                stats: {
                  totalComments,
                  filteredComments: totalComments - filteredComments.length,
                  analyzedComments,
                },
                categories,
              },
            });
          } catch (error: any) {
            set({ status: 'error', error: { code: 'ANALYSIS_FAILED', message: error.message || 'An unknown error occurred.' } });
          }
        },
        reset: () => {
            get().actions.stopLiveSession();
            set(initialState);
            get().actions.checkConfig();
        },
        addReply: (category, commentId, text) => { /* Not implemented for this version */ },
        editComment: (category, commentId, text, replyId) => { /* Not implemented for this version */ },
        loadMoreReplies: async (category, commentId) => {
            const { youtubeApiKey } = get();
            if (!youtubeApiKey) return;
            // Simplified implementation
            console.log(`Loading more replies for ${commentId} in ${category}`);
        },
        startLiveSession: async () => { /* Stub for live session */ },
        stopLiveSession: () => { /* Stub for live session */ },
      },
    }),
    {
      name: 'youtube-comment-analyzer-storage',
      storage: createJSONStorage(() => chrome.storage.local),
      partialize: (state) => ({
        youtubeApiKey: state.youtubeApiKey,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);
