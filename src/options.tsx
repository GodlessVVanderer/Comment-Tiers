// FIX: Remove reference to chrome types which are unavailable in this environment.
// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

// FIX: Implement the extension options page.
// FIX: Correct import syntax for hooks.
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useAppStore } from './store';
import './style.css';
import ApiKeyHelpModal from './components/ApiKeyHelpModal';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import PricingInfoModal from './components/PricingInfoModal';

const Options = () => {
  const { youtubeApiKey, geminiApiKey, actions } = useAppStore();
  const [ytKey, setYtKey] = useState('');
  const [gKey, setGKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [showYtHelp, setShowYtHelp] = useState(false);
  const [showGeminiHelp, setShowGeminiHelp] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    // Zustand persistence might take a moment to rehydrate
    // FIX: `onRehydrate` is deprecated in zustand's persist middleware. Using `onFinishHydration` instead.
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      setYtKey(useAppStore.getState().youtubeApiKey || '');
      setGKey(useAppStore.getState().geminiApiKey || '');
    });
    
    setYtKey(youtubeApiKey || '');
    setGKey(geminiApiKey || '');

    return () => {
      unsubscribe();
    }
  }, [youtubeApiKey, geminiApiKey]);

  const handleSave = () => {
    actions.setYoutubeApiKey(ytKey);
    actions.setGeminiApiKey(gKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-300 font-sans p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Comment Analyzer Settings</h1>
        <p className="text-gray-400 mb-8">API keys are stored using your browser's sync storage and synced across devices.</p>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <label htmlFor="youtube-api-key" className="block text-lg font-medium text-white">YouTube Data API Key</label>
            <p className="text-sm text-gray-400 mt-1 mb-3">Required to fetch comments from YouTube videos.</p>
            <input
              id="youtube-api-key"
              type="password"
              value={ytKey}
              onChange={(e) => setYtKey(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
              placeholder="Enter your YouTube API Key"
            />
            <button onClick={() => setShowYtHelp(true)} className="text-xs text-blue-400 hover:underline mt-2">Where do I find this?</button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <label htmlFor="gemini-api-key" className="block text-lg font-medium text-white">Google Gemini API Key</label>
            <p className="text-sm text-gray-400 mt-1 mb-3">Required to analyze and categorize comments.</p>
            <input
              id="gemini-api-key"
              type="password"
              value={gKey}
              onChange={(e) => setGKey(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
              placeholder="Enter your Gemini API Key"
            />
             <button onClick={() => setShowGeminiHelp(true)} className="text-xs text-blue-400 hover:underline mt-2">Where do I find this?</button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
            <button onClick={() => setShowPricing(true)} className="text-sm text-gray-400 hover:underline">Important: API Usage & Pricing Info</button>
            <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
                {saved ? 'Saved!' : 'Save Settings'}
            </button>
        </div>
      </div>
      {showYtHelp && <ApiKeyHelpModal onClose={() => setShowYtHelp(false)} />}
      {showGeminiHelp && <GeminiApiKeyHelpModal onClose={() => setShowGeminiHelp(false)} />}
      {showPricing && <PricingInfoModal onClose={() => setShowPricing(false)} />}
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <Options />
      </React.StrictMode>
    );
}