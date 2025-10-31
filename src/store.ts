// FIX: Remove reference to chrome types which are unavailable in this environment.
// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

// FIX: Implement Zustand store for state management.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppError, AppStatus, AnalysisResults, Progress, LiveSessionState, Comment, Category, TranscriptionTurn, LiveSessionStatus } from './types';
import * as youtubeService from './services/youtubeService';
import * as geminiService from './services/geminiService';
import * as liveService from './services/liveService';
import { COMMENT_CATEGORIES, DEFAULT_COMMENT_LIMIT } from './constants';
import { batch } from './utils';

interface AppState {
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  status: AppStatus;
  progress: Progress;
  results: AnalysisResults | null;
  error: AppError | null;
  configError: string | null;
  commentLimit: number;
  liveSession: LiveSessionState;
  isPricingModalOpen: boolean;

  actions: {
    setYoutubeApiKey: (key: string) => void;
    setGeminiApiKey: (key: string) => void;
    setCommentLimit: (limit: number) => void;
    validateKeys: () => Promise<void>;
    analyze: () => Promise<void>;
    reset: () => void;
    addReply: (categoryName: string, commentId: string, text: string) => void;
    editComment: (categoryName: string, commentId: string, text: string, replyId?: string) => void;
    loadMoreReplies: (categoryName: string, commentId: string) => void;
    startLiveSession: () => Promise<void>;
    stopLiveSession: () => void;
    togglePricingModal: () => void;
  };
}

const initialState = {
  youtubeApiKey: null,
  geminiApiKey: null,
  status: 'idle' as AppStatus,
  progress: { phase: 'fetching', percent: 0 } as Progress,
  results: null,
  error: null,
  configError: null,
  commentLimit: DEFAULT_COMMENT_LIMIT,
  isPricingModalOpen: false,
  liveSession: {
    status: 'idle',
    transcription: [],
    error: null,
  } as LiveSessionState,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      actions: {
        setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
        setGeminiApiKey: (key) => set({ geminiApiKey: key }),
        setCommentLimit: (limit) => set({ commentLimit: limit }),
        togglePricingModal: () => set(state => ({ isPricingModalOpen: !state.isPricingModalOpen })),
        
        validateKeys: async () => {
          const { youtubeApiKey, geminiApiKey } = get();
          if (!youtubeApiKey) {
            set({ status: 'config-error', configError: 'YouTube API Key is not set.' });
            return;
          }
          if (!geminiApiKey) {
            set({ status: 'config-error', configError: 'Gemini API Key is not set.' });
            return;
          }
          set({ status: 'idle', configError: null });
        },

        analyze: async () => {
          const { youtubeApiKey, geminiApiKey, commentLimit } = get();
          await get().actions.validateKeys();
          if (get().status === 'config-error' || !youtubeApiKey || !geminiApiKey) {
            return;
          }

          set({ status: 'loading', progress: { phase: 'fetching', percent: 0 }, error: null, results: null });

          try {
            // 1. Fetch comments
            const videoId = youtubeService.getVideoIdFromUrl();
            if (!videoId) throw new Error("Could not find YouTube video ID on this page.");
            
            const allComments = await youtubeService.fetchAllComments(youtubeApiKey, videoId, commentLimit, (progress) => {
              set({ progress: { ...progress, phase: 'fetching' } });
            });

            // 2. Filter comments (basic)
            set({ status: 'loading', progress: { phase: 'filtering', percent: 0 } });
            const filteredComments = allComments.filter(c => c.text.length > 10 && !c.text.toLowerCase().includes('sub'));
            
            const stats = {
              totalComments: allComments.length,
              filteredComments: allComments.length - filteredComments.length,
              analyzedComments: filteredComments.length
            };
            
            // 3. Analyze comments
            set({ status: 'loading', progress: { phase: 'analyzing', percent: 0, processed: 0, total: filteredComments.length } });
            
            const commentMap = new Map(filteredComments.map(c => [c.id, c]));
            const commentBatches = batch(filteredComments, 50);
            const categorizedIds: Record<string, string[]> = {};
            COMMENT_CATEGORIES.forEach(c => categorizedIds[c.name] = []);
            
            let processedCount = 0;
            for (const currentBatch of commentBatches) {
              const result = await geminiService.analyzeCommentBatch(geminiApiKey, currentBatch);
              result.forEach(item => {
                if(categorizedIds[item.category]) {
                    categorizedIds[item.category].push(...item.comment_ids);
                }
              });
              processedCount += currentBatch.length;
              set({ progress: { phase: 'analyzing', percent: (processedCount / filteredComments.length) * 100, processed: processedCount, total: filteredComments.length } });
            }
            
            const categories: Category[] = COMMENT_CATEGORIES.map(c => ({
              category: c.name,
              summary: '',
              comments: (categorizedIds[c.name] || []).map(id => commentMap.get(id)).filter((c): c is Comment => !!c)
            })).filter(c => c.comments.length > 0);

            // 4. Summarize categories
            set({ status: 'loading', progress: { phase: 'summarizing', percent: 0, processed: 0, total: categories.length } });
            
            for(let i=0; i<categories.length; i++) {
                if (categories[i].comments.length > 0) {
                    const summary = await geminiService.summarizeCategory(geminiApiKey, categories[i]);
                    categories[i].summary = summary;
                }
                set({ progress: { phase: 'summarizing', percent: ((i+1) / categories.length) * 100, processed: i+1, total: categories.length } });
            }

            set({ status: 'results', results: { stats, categories } });
          } catch (error: any) {
            console.error(error);
            set({ status: 'error', error: { code: error.cause || 'UNKNOWN', message: error.message } });
          }
        },

        reset: () => {
          const { youtubeApiKey, geminiApiKey, commentLimit } = get();
          set({ ...initialState, youtubeApiKey, geminiApiKey, commentLimit });
          get().actions.validateKeys();
        },

        addReply: (categoryName, commentId, text) => {},
        editComment: (categoryName, commentId, text, replyId) => {},
        loadMoreReplies: async (categoryName, commentId) => {
            // NOTE: Full implementation requires OAuth2, which is beyond the scope of API key auth.
            console.log(`Loading more replies for ${commentId} in ${categoryName}`);
        },

        startLiveSession: async () => {
          const { geminiApiKey } = get();
          if (!geminiApiKey) {
            set({ liveSession: { ...get().liveSession, error: "Gemini API Key not set." } });
            return;
          }
          set({ liveSession: { status: 'listening', transcription: [], error: null } });
          try {
            await liveService.startSession(geminiApiKey, {
              onTranscriptionUpdate: (turn) => {
                set(state => {
                    const newTranscription = [...state.liveSession.transcription];
                    const lastTurn = newTranscription[newTranscription.length - 1];
                    if (lastTurn && lastTurn.speaker === turn.speaker) {
                        lastTurn.text = turn.text;
                    } else if (turn.text.trim()) {
                        newTranscription.push(turn);
                    }
                    return { liveSession: { ...state.liveSession, transcription: newTranscription } };
                });
              },
              onStatusUpdate: (status: LiveSessionStatus) => set(state => ({ liveSession: { ...state.liveSession, status }})),
              onError: (error: string) => set(state => ({ liveSession: { ...state.liveSession, status: 'idle', error }})),
            });
          } catch(e: any) {
             set(state => ({ liveSession: { ...state.liveSession, status: 'idle', error: e.message }}));
          }
        },
        stopLiveSession: () => {
          liveService.stopSession();
          set((state) => ({
            liveSession: {
              ...state.liveSession,
              status: 'idle',
              transcription: [],
              error: null,
            },
          }));
        },
      },
    }),
    {
      name: 'youtube-comment-analyzer-storage',
      storage: createJSONStorage(() => chrome.storage.sync),
      partialize: (state) => ({
        youtubeApiKey: state.youtubeApiKey,
        geminiApiKey: state.geminiApiKey,
        commentLimit: state.commentLimit,
      }),
    }
  )
);