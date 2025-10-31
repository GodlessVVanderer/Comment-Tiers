import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchComments } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import { AnalysisResults, Comment } from './types';

type AppStatus = 'idle' | 'loading' | 'error' | 'success' | 'configuring';

interface AppState {
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  status: AppStatus;
  error: string | null;
  progress: number;
  videoId: string | null;
  results: AnalysisResults | null;
  isHelpModalOpen: boolean;
  isGeminiHelpModalOpen: boolean;
  isPricingModalOpen: boolean;
  actions: {
    setYoutubeApiKey: (key: string | null) => void;
    setGeminiApiKey: (key: string | null) => void;
    setVideoId: (id: string) => void;
    analyze: () => Promise<void>;
    reset: () => void;
    toggleHelpModal: () => void;
    toggleGeminiHelpModal: () => void;
    togglePricingModal: () => void;
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      youtubeApiKey: null,
      geminiApiKey: null,
      status: 'idle',
      error: null,
      progress: 0,
      videoId: null,
      results: null,
      isHelpModalOpen: false,
      isGeminiHelpModalOpen: false,
      isPricingModalOpen: false,
      actions: {
        setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
        setGeminiApiKey: (key) => set({ geminiApiKey: key }),
        setVideoId: (id) => set({ videoId: id }),
        toggleHelpModal: () => set((state) => ({ isHelpModalOpen: !state.isHelpModalOpen })),
        toggleGeminiHelpModal: () => set((state) => ({ isGeminiHelpModalOpen: !state.isGeminiHelpModalOpen })),
        togglePricingModal: () => set((state) => ({ isPricingModalOpen: !state.isPricingModalOpen })),
        reset: () => set({ status: 'idle', error: null, progress: 0, results: null }),
        analyze: async () => {
          const { videoId, youtubeApiKey, geminiApiKey } = get();
          if (!videoId || !youtubeApiKey || !geminiApiKey) {
            set({ status: 'configuring', error: 'API keys are missing.' });
            return;
          }

          set({ status: 'loading', error: null, progress: 0 });

          try {
            const comments = await fetchComments(videoId, youtubeApiKey, (progress) => {
              set({ progress });
            });

            if (comments.length === 0) {
              set({ status: 'success', results: { summary: 'No comments found or comments are disabled.', categories: [], sentiment: { positive: 0, negative: 0, neutral: 0 } } });
              return;
            }

            const results = await analyzeComments(comments, geminiApiKey);
            set({ status: 'success', results });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            set({ status: 'error', error: errorMessage });
          }
        },
      },
    }),
    {
      name: 'comment-analyzer-storage',
      partialize: (state) => ({
        youtubeApiKey: state.youtubeApiKey,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);
