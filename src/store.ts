import { create } from 'zustand';
import { AnalysisResults } from './types';

export type AppStatus = 'idle' | 'loading' | 'results' | 'error' | 'config_error';

interface AppState {
  status: AppStatus;
  results: AnalysisResults | null;
  error: string | null;
  apiKey: string;
  geminiApiKey: string;
  setStatus: (status: AppStatus) => void;
  setResults: (results: AnalysisResults | null) => void;
  setError: (error: string | null) => void;
  setApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  status: 'idle',
  results: null,
  error: null,
  apiKey: '',
  geminiApiKey: '',
  setStatus: (status) => set({ status }),
  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  setApiKey: (key) => set({ apiKey: key }),
  setGeminiApiKey: (key) => set({ geminiApiKey: key }),
}));
