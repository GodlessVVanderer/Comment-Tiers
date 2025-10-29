
import { create } from 'zustand';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

interface AppState {
  youtubeApiKey: string | null;
  geminiApiKey: string | null;
  setYoutubeApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  initialize: () => Promise<void>;
  isInitialized: boolean;
}

export const useAppStore = create<AppState>((set) => ({
  youtubeApiKey: null,
  geminiApiKey: null,
  isInitialized: false,

  setYoutubeApiKey: (key: string) => set({ youtubeApiKey: key }),
  setGeminiApiKey: (key: string) => set({ geminiApiKey: key }),

  initialize: async () => {
    // Prevent re-initialization
    if (useAppStore.getState().isInitialized) return;

    try {
      const result = await new Promise<{ [key: string]: any }>((resolve) => {
        chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], resolve);
      });

      set({
        youtubeApiKey: result.youtubeApiKey || null,
        geminiApiKey: result.geminiApiKey || null,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to initialize store from chrome.storage:', error);
      set({ isInitialized: true }); // Mark as initialized even on error
    }
  },
}));

// Listen for updates from other parts of the extension (e.g., options page)
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request: { action: string }) => {
        if (request.action === 'keys-updated') {
            // Re-initialize the store to fetch the latest keys
            useAppStore.setState({ isInitialized: false });
            useAppStore.getState().initialize();
        }
    });
}
