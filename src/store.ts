import { create } from 'zustand';
import { AnalysisResult, AppStatus, Comment, VideoDetails } from './types';

interface AppState {
    status: AppStatus;
    analysisResult: AnalysisResult | null;
    error: string | null;
    videoDetails: VideoDetails | null;
    comments: Comment[];
    
    setStatus: (status: AppStatus) => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setError: (error: string | null) => void;
    setVideoDetails: (details: VideoDetails | null) => void;
    setComments: (comments: Comment[]) => void;
    reset: () => void;
}

export const useStore = create<AppState>((set) => ({
    status: 'idle',
    analysisResult: null,
    error: null,
    videoDetails: null,
    comments: [],

    setStatus: (status) => set({ status }),
    setAnalysisResult: (result) => set({ analysisResult: result, status: result ? 'success' : 'idle' }),
    setError: (error) => set({ error, status: 'error' }),
    setVideoDetails: (details) => set({ videoDetails: details }),
    setComments: (comments) => set({ comments }),
    reset: () => set({
        status: 'idle',
        analysisResult: null,
        error: null,
        videoDetails: null,
        comments: [],
    }),
}));
