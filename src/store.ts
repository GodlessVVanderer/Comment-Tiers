
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  AppStatus,
  Category,
  AnalysisStats,
  Progress,
  AppError,
  TranscriptionTurn,
  Comment,
} from './types';
import { fetchAllComments } from './services/youtubeService';
import { prefilterComments } from './utils';
import { analyzeComments } from './services/geminiService';
import { DEFAULT_COMMENT_LIMIT } from './constants';
import * as liveService from './services/liveService';

declare const chrome: any;

interface AppState {
  // Core state
  status: AppStatus;
  progress: Progress;
  results: Category[];
  stats: AnalysisStats | null;
  error: AppError | null;
  configError: string | null;
  videoId: string | null;

  // Config
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  commentLimit: number;

  // UI State
  isApiKeyHelpModalOpen: boolean;
  isGeminiHelpModalOpen: boolean;
  isPricingInfoModalOpen: boolean;

  // Live session state
  liveSession: {
    isActive: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    statusMessage: string;
    error: string | null;
  };
  transcription: TranscriptionTurn[];
}

interface AppActions {
  initialize: (videoId: string | null) => void;
  reset: () => void;
  setCommentLimit: (limit: number) => void;
  analyze: (videoId: string) => Promise<void>;

  // UI Actions
  openApiKeyHelpModal: () => void;
  closeApiKeyHelpModal: () => void;
  openGeminiHelpModal: () => void;
  closeGeminiHelpModal: () => void;
  openPricingInfoModal: () => void;
  closePricingInfoModal: () => void;
  
  // Live session actions
  startLiveConversation: () => Promise<void>;
  stopLiveConversation: () => void;
}

const initialState: AppState = {
  status: 'idle',
  progress: { processed: 0, total: 0 },
  results: [],
  stats: null,
  error: null,
  configError: null,
  videoId: null,
  youtubeApiKey: null,
  geminiApiKey: null,
  commentLimit: DEFAULT_COMMENT_LIMIT,
  isApiKeyHelpModalOpen: false,
  isGeminiHelpModalOpen: false,
  isPricingInfoModalOpen: false,
  liveSession: {
    isActive: false,
    isListening: false,
    isSpeaking: false,
    statusMessage: 'Not connected',
    error: null,
  },
  transcription: [],
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      initialize: (videoId) => {
        const { youtubeApiKey, geminiApiKey } = get();
        set((state) => {
            state.videoId = videoId;
            state.status = 'idle';
            state.results = [];
            state.stats = null;
            state.error = null;
            state.transcription = [];
            state.liveSession = initialState.liveSession;

            if (!youtubeApiKey || !geminiApiKey) {
                state.configError = 'YouTube and/or Gemini API key is not set.';
            } else {
                state.configError = null;
            }
        });
      },

      reset: () => set(initialState),

      setCommentLimit: (limit) => set({ commentLimit: limit }),

      analyze: async (videoId) => {
        const { youtubeApiKey, geminiApiKey, commentLimit } = get();
        if (!youtubeApiKey || !geminiApiKey) {
          set({ configError: 'API keys are not set.' });
          return;
        }

        set({ status: 'fetching', error: null, configError: null, progress: { processed: 0, total: commentLimit } });
        const startTime = Date.now();
        
        try {
          // 1. Fetch comments
          const rawComments = await fetchAllComments(videoId, youtubeApiKey, commentLimit, (processed, total) => {
            set((state) => {
              state.progress = { processed, total };
            });
          });
          const fetchedCount = rawComments.length;

          // 2. Prefilter comments
          set({ status: 'filtering', progress: { processed: 0, total: fetchedCount } });
          const filteredCommentTexts = await prefilterComments(rawComments, (processed) => {
             set(state => { state.progress.processed = processed; });
          });
          const analyzedCount = filteredCommentTexts.length;

          // 3. Analyze with Gemini
          set({ status: 'analyzing', progress: { processed: 0, total: analyzedCount } });
          const userLanguage = navigator.language || 'en';
          const analysisResult = await analyzeComments(filteredCommentTexts, geminiApiKey, (processed) => {
            set((state) => { state.progress.processed = processed; });
          }, userLanguage);

          // 4. Process results
          const commentMap = new Map<string, Comment>();
          const flatComments: Comment[] = [];

          rawComments.forEach(item => {
            const topLevelComment = item.snippet.topLevelComment;
            const mapComment = (c: any): Comment => ({
                id: c.id,
                text: c.snippet.textOriginal,
                author: c.snippet.authorDisplayName,
                authorProfileImageUrl: c.snippet.authorProfileImageUrl,
                likeCount: c.snippet.likeCount,
                publishedAt: c.snippet.publishedAt,
                replies: [],
            });
            const comment = mapComment(topLevelComment);
            if (item.replies?.comments) {
                comment.replies = item.replies.comments.map(mapComment);
            }
            flatComments.push(comment, ...(comment.replies || []));
          });
          
          flatComments.forEach(c => commentMap.set(c.text, c));

          const enrichedCategories: Category[] = analysisResult.categories
            .map(category => ({
                ...category,
                comments: category.comments.map(text => commentMap.get(text)).filter((c): c is Comment => !!c)
            }))
            .filter(category => category.comments.length > 0);

          const allAnalyzedComments = enrichedCategories.flatMap(c => c.comments);
          const totalLikes = allAnalyzedComments.reduce((sum, comment) => sum + comment.likeCount, 0);
          const totalReplies = allAnalyzedComments.reduce((sum, comment) => sum + (comment.replies?.length || 0), 0);

          const duration = (Date.now() - startTime) / 1000;
          
          set({
            status: 'success',
            results: enrichedCategories,
            stats: {
                totalCommentsFetched: fetchedCount,
                totalCommentsAnalyzed: analyzedCount,
                analysisDurationSeconds: duration,
                totalLikesOnAnalyzedComments: totalLikes,
                totalRepliesOnAnalyzedComments: totalReplies,
            },
          });

        } catch (e: any) {
          const code = e.message || 'UNKNOWN_ERROR';
          const messageMap: Record<string, string> = {
            'YOUTUBE_INVALID_KEY': 'Your YouTube API key is invalid. Please check it in the options.',
            'YOUTUBE_QUOTA_EXCEEDED': 'You have exceeded your YouTube API quota. Please wait or increase your quota.',
            'YOUTUBE_API_ERROR': 'An error occurred while fetching comments from YouTube.',
            'GEMINI_INVALID_KEY': 'Your Gemini API key is invalid. Please check it in the options.',
            'GEMINI_QUOTA_EXCEEDED': 'You have exceeded your Gemini API quota.',
            'GEMINI_API_ERROR': 'An error occurred while analyzing comments with Gemini.',
            'UNKNOWN_ERROR': 'An unexpected error occurred during analysis.'
          };
          set({ status: 'error', error: { code, message: messageMap[code] || messageMap['UNKNOWN_ERROR'] } });
        }
      },

      // UI Actions
      openApiKeyHelpModal: () => set({ isApiKeyHelpModalOpen: true }),
      closeApiKeyHelpModal: () => set({ isApiKeyHelpModalOpen: false }),
      openGeminiHelpModal: () => set({ isGeminiHelpModalOpen: true }),
      closeGeminiHelpModal: () => set({ isGeminiHelpModalOpen: false }),
      openPricingInfoModal: () => set({ isPricingInfoModalOpen: true }),
      closePricingInfoModal: () => set({ isPricingInfoModalOpen: false }),

      // Live Session
      startLiveConversation: async () => {
        const { geminiApiKey } = get();
        if (!geminiApiKey) {
            set(state => { state.liveSession.error = 'Gemini API key is not set.'; });
            return;
        }
        set(state => {
            state.liveSession.isActive = true;
            state.liveSession.statusMessage = 'Initializing...';
            state.transcription = [];
        });

        try {
            await liveService.startLiveSession(geminiApiKey, {
                onListening: () => set(state => { 
                    state.liveSession.isListening = true;
                    state.liveSession.isSpeaking = false;
                    state.liveSession.statusMessage = 'Listening...';
                }),
                onSpeaking: () => set(state => { 
                    state.liveSession.isListening = false;
                    state.liveSession.isSpeaking = true;
                    state.liveSession.statusMessage = 'Speaking...';
                }),
                onIdle: () => set(state => {
                    state.liveSession.isListening = true; // Go back to listening when model is done
                    state.liveSession.isSpeaking = false;
                    state.liveSession.statusMessage = 'Listening...';
                }),
                onTranscription: (turn) => set(state => { state.transcription.push(turn); }),
                onError: (message) => set(state => {
                    state.liveSession.error = message;
                    state.liveSession.isActive = false;
                    state.liveSession.statusMessage = 'Error';
                }),
            });
        } catch (e: any) {
             set(state => {
                state.liveSession.error = e.message;
                state.liveSession.isActive = false;
                state.liveSession.statusMessage = 'Error';
            });
        }
      },

      stopLiveConversation: () => {
        liveService.stopLiveSession();
        set(state => {
            state.liveSession = initialState.liveSession;
        });
      },

    })),
    {
      name: 'comment-analyzer-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
            return new Promise(resolve => {
                chrome.storage.local.get([name], (result) => {
                    resolve(result[name] ?? null);
                });
            });
        },
        setItem: (name, value) => {
            chrome.storage.local.set({ [name]: value });
        },
        removeItem: (name) => {
            chrome.storage.local.remove(name);
        },
      })),
      partialize: (state) => ({
        youtubeApiKey: state.youtubeApiKey,
        geminiApiKey: state.geminiApiKey,
        commentLimit: state.commentLimit,
      }),
    }
  )
);
