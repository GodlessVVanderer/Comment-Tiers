import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useAppStore } from './store';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import './style.css'; // Ensure tailwind styles are applied

const Options: React.FC = () => {
  const { youtubeApiKey, geminiApiKey, actions } = useAppStore();
  const [localYoutubeKey, setLocalYoutubeKey] = useState('');
  const [localGeminiKey, setLocalGeminiKey] = useState('');
  const [isGeminiHelpVisible, setGeminiHelpVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // zustand persistence might take a moment to rehydrate
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
        const state = useAppStore.getState();
        setLocalYoutubeKey(state.youtubeApiKey);
        setLocalGeminiKey(state.geminiApiKey);
        setIsInitialized(true);
    });

    // If already hydrated, set state immediately
    if (useAppStore.persist.hasHydrated()) {
        const state = useAppStore.getState();
        setLocalYoutubeKey(state.youtubeApiKey);
        setLocalGeminiKey(state.geminiApiKey);
        setIsInitialized(true);
    }
    
    return () => {
        unsubscribe();
    }
  }, []);


  const handleSave = () => {
    actions.setYoutubeApiKey(localYoutubeKey);
    actions.setGeminiApiKey(localGeminiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="youtube-key" className="block text-sm font-medium text-gray-400 mb-1">
              YouTube Data API v3 Key
            </label>
            <input
              type="password"
              id="youtube-key"
              value={localYoutubeKey}
              onChange={(e) => setLocalYoutubeKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your YouTube API Key"
            />
             <p className="text-xs text-gray-500 mt-1">
                Required to fetch comments. See{' '}
                <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    how to get a key
                </a>.
            </p>
          </div>
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-400 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              id="gemini-key"
              value={localGeminiKey}
              onChange={(e) => setLocalGeminiKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Gemini API Key"
            />
            <button onClick={() => setGeminiHelpVisible(true)} className="text-xs text-blue-400 hover:underline mt-1">
              How do I get this?
            </button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
      {isGeminiHelpVisible && <GeminiApiKeyHelpModal onClose={() => setGeminiHelpVisible(false)} />}
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <Options />
      </React.StrictMode>
    );
}
