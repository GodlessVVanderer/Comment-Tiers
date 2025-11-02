import { create } from 'zustand';
import { AnalysisResult, AppStatus, AuthState, VideoDetails } from './types';
import * as youtubeService from './services/youtubeService';
import * as geminiService from './services/geminiService';
import * as authService from './services/authService';

// App State Store
interface AppState {
    appStatus: AppStatus;
    analysisResult: AnalysisResult | null;
    videoDetails: VideoDetails | null;
    error: string | null;
    actions: {
        startAnalysis: (videoId: string) => Promise<void>;
        reset: () => void;
    };
}

export const useAppStore = create<AppState>((set) => ({
    appStatus: 'idle',
    analysisResult: null,
    videoDetails: null,
    error: null,
    actions: {
        startAnalysis: async (videoId: string) => {
            set({ appStatus: 'loading', error: null });
            try {
                // Fetch video details and comments in parallel
                const [videoDetails, comments] = await Promise.all([
                    youtubeService.getVideoDetails(videoId),
                    youtubeService.getAllComments(videoId),
                ]);
                set({ videoDetails });
                
                // Then, analyze the comments
                const analysisResult = await geminiService.analyzeComments(comments);
                set({ appStatus: 'success', analysisResult });

            } catch (err: any) {
                console.error("Analysis failed:", err);
                // Differentiate config errors from runtime errors
                if (err.message.includes("key") || err.message.includes("API")) {
                    set({ appStatus: 'config-error', error: err.message });
                } else {
                    set({ appStatus: 'error', error: err.message });
                }
            }
        },
        reset: () => set({
            appStatus: 'idle',
            analysisResult: null,
            videoDetails: null,
            error: null,
        }),
    },
}));


// Auth State Store
interface AuthStore {
    authState: AuthState;
    actions: {
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        checkAuthStatus: () => Promise<void>;
    }
}

export const useAuthStore = create<AuthStore>((set) => ({
    authState: {
        status: 'loading',
        token: null,
        error: null,
    },
    actions: {
        signIn: async () => {
            set(state => ({ authState: { ...state.authState, status: 'loading' }}));
            try {
                const token = await authService.signIn();
                set({ authState: { status: 'authenticated', token, error: null } });
            } catch (err: any) {
                set({ authState: { status: 'error', token: null, error: err.message } });
            }
        },
        signOut: async () => {
            await authService.signOut();
            set({ authState: { status: 'unauthenticated', token: null, error: null } });
        },
        checkAuthStatus: async () => {
            try {
                const token = await authService.checkAuthStatus();
                if (token) {
                    set({ authState: { status: 'authenticated', token, error: null } });
                } else {
                    set({ authState: { status: 'unauthenticated', token: null, error: null } });
                }
            } catch (err: any) {
                set({ authState: { status: 'unauthenticated', token: null, error: null } });
            }
        },
    },
}));
