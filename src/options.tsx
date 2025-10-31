// FIX: Add chrome type declaration to fix build errors due to missing @types/chrome.
declare const chrome: any;

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useAppStore } from './store'; // Assuming a store setup
import './style.css';
import { ApiKeyHelpModal } from './components/ApiKeyHelpModal';
import { GeminiApiKeyHelpModal } from './components/GeminiApiKeyHelpModal';

// This is a workaround for Zustand's async storage in Chrome extensions
const useHydratedStore = () => {
  const store = useAppStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return hydrated ? store : null;
};

const Options = () => {
  const store = useHydratedStore();
  const [youtubeKey, setYoutubeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const { 
    isApiKeyHelpModalOpen, 
    isGeminiHelpModalOpen,
    openApiKeyHelpModal,
    closeApiKeyHelpModal,
    openGeminiHelpModal,
    closeGeminiHelpModal
  } = useAppStore();

  useEffect(() => {
    if (store) {
      setYoutubeKey(store.youtubeApiKey || '');
      setGeminiKey(store.geminiApiKey || '');
    }
  }, [store]);
  
  const handleSave = () => {
    useAppStore.setState({ youtubeApiKey: youtubeKey, geminiApiKey: geminiKey });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    // Notify content scripts that keys have been updated
    chrome.tabs.query({ url: "https://www.youtube.com/watch*" }, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'keys-updated' });
        }
      });
    });
  };

  if (!store) {
    return (
      <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-gray-300">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-gray-300 font-sans">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <div>
          <label htmlFor="youtube-key" className="block text-sm font-medium text-gray-400 mb-1">
            YouTube Data API v3 Key
          </label>
          <input
            type="password"
            id="youtube-key"
            value={youtubeKey}
            onChange={(e) => setYoutubeKey(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={openApiKeyHelpModal} className="text-xs text-blue-400 hover:underline mt-1">
            How to get this key?
          </button>
        </div>

        <div>
          <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-400 mb-1">
            Google Gemini API Key
          </label>
          <input
            type="password"
            id="gemini-key"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button onClick={openGeminiHelpModal} className="text-xs text-blue-400 hover:underline mt-1">
            How to get this key?
          </button>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          {isSaved ? 'Saved!' : 'Save Keys'}
        </button>
      </div>
      
      {isApiKeyHelpModalOpen && <ApiKeyHelpModal onClose={closeApiKeyHelpModal} />}
      {isGeminiHelpModalOpen && <GeminiApiKeyHelpModal onClose={closeGeminiHelpModal} />}
    </div>
  );
};

const initialize = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Options />
        </React.StrictMode>
    );
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}