import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AppStatus,
  AnalysisResult,
  Progress,
  YouTubeComment,
  LiveSessionStatus,
  TranscriptionTurn
} from './types';
import { fetchComments } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import { startSession, stopSession } from './services/liveService';

interface AppState {
  youtubeApiKey: string;
  geminiApiKey: string;
  status: AppStatus;
  progress: Progress;
  analysisResult: AnalysisResult | null;
  error: string | null;
  liveSession: {
    status: LiveSessionStatus;
    transcription: TranscriptionTurn[];
    error: string | null;
  };
  actions: {
    setYoutubeApiKey: (key: string) => void;
    setGeminiApiKey: (key: string) => void;
    startAnalysis: (videoId: string, commentLimit: number) => Promise<void>;
    reset: () => void;
    startLiveSession: () => void;
    stopLiveSession: () => void;
  };
}

const initialState = {
  youtubeApiKey: '',
  geminiApiKey: '',
  status: 'idle' as AppStatus,
  progress: { value: 0, text: '' },
  analysisResult: null,
  error: null,
  liveSession: {
    status: 'idle' as LiveSessionStatus,
    transcription: [],
    error: null,
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      actions: {
        setYoutubeApiKey: (key) => set({ youtubeApiKey: key }),
        setGeminiApiKey: (key) => set({ geminiApiKey: key }),
        reset: () => set({ status: 'idle', progress: { value: 0, text: '' }, error: null, analysisResult: null, liveSession: { ...initialState.liveSession, transcription: [] } }),
        startAnalysis: async (videoId, commentLimit) => {
          const { youtubeApiKey, geminiApiKey } = get();
          if (!youtubeApiKey || !geminiApiKey) {
            set({ status: 'config-error', error: 'API keys are not set.' });
            return;
          }

          set({ status: 'loading', progress: { value: 0, text: 'Starting analysis...' }, error: null, analysisResult: null });

          try {
            const comments: YouTubeComment[] = await fetchComments(
              videoId,
              youtubeApiKey,
              commentLimit,
              (progress) => {
                set({ progress: { value: progress.value, text: `Fetching comments: ${progress.fetched}/${progress.total}...` } });
              }
            );
            
            if (comments.length === 0) {
              set({ status: 'error', error: 'No comments found for this video.' });
              return;
            }

            set({ progress: { value: 50, text: `Analyzing ${comments.length} comments...` } });

            const result = await analyzeComments(
              comments,
              geminiApiKey,
              (progress) => {
                const baseProgress = 50;
                set({ progress: { value: baseProgress + (progress.processed / progress.total) * 50, text: `Analyzing... (${progress.processed}/${progress.total})`, eta: progress.eta } });
              }
            );
            
            set({ status: 'results', analysisResult: result, progress: { value: 100, text: 'Analysis complete' } });

          } catch (error: any) {
            console.error(error);
            const errorMessage = error.message || 'An unknown error occurred.';
            set({ status: 'error', error: `Analysis failed: ${errorMessage}` });
          }
        },
        startLiveSession: () => {
          const { geminiApiKey } = get();
          if (!geminiApiKey) {
            set(state => ({
              liveSession: { ...state.liveSession, status: 'idle', error: 'Gemini API key is not set.' },
            }));
            return;
          }

          set(state => ({
            liveSession: { ...state.liveSession, status: 'loading', error: null, transcription: [] },
          }));

          startSession(geminiApiKey, {
            onStatusUpdate: (status) => {
              set(state => ({ liveSession: { ...state.liveSession, status } }));
            },
            onTranscriptionUpdate: (turn) => {
               set(state => {
                 const newTranscription = [...state.liveSession.transcription];
                 const lastTurn = newTranscription[newTranscription.length - 1];
                 if (lastTurn && lastTurn.speaker === turn.speaker && !lastTurn.isFinal) {
                   lastTurn.text = turn.text;
                   lastTurn.isFinal = turn.isFinal;
                 } else {
                   // find if we are updating a previous non-final turn
                   const existingTurnIndex = newTranscription.findIndex(t => t.speaker === turn.speaker && !t.isFinal);
                   if (existingTurnIndex !== -1) {
                      newTranscription[existingTurnIndex] = { ...newTranscription[existingTurnIndex], text: turn.text, isFinal: turn.isFinal };
                   } else {
                      newTranscription.push(turn);
                   }
                 }
                 return { liveSession: { ...state.liveSession, transcription: newTranscription.filter(t => t.text) } };
               });
            },
            onError: (error) => {
              set(state => ({
                liveSession: { ...state.liveSession, status: 'idle', error },
              }));
            },
          });
        },
        stopLiveSession: () => {
          stopSession();
          set(state => ({
            liveSession: { ...state.liveSession, status: 'idle' },
          }));
        },
      },
    }),
    {
      name: 'youtube-comment-analyzer-storage',
      // @ts-ignore
      storage: createJSONStorage(() => chrome.storage.local),
      partialize: (state) => ({ youtubeApiKey: state.youtubeApiKey, geminiApiKey: state.geminiApiKey }),
    }
  )
);
