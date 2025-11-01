declare const chrome: any;

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Use relative path for module import.
import { useAppStore } from './store';
import './style.css';
import ApiKeyHelpModal from './components/ApiKeyHelpModal';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import PricingInfoModal from './components/PricingInfoModal';
import { EyeIcon, EyeSlashIcon } from './components/Icons';
// FIX: Use relative path for module import.
import { COMMENT_LIMIT_OPTIONS } from './constants';

const Options = () => {
  const { youtubeApiKey, geminiApiKey, commentLimit, actions } = useAppStore();
  const [ytKey, setYtKey] = useState('');
  const [gKey, setGKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [showYtHelp, setShowYtHelp] = useState(false);
  const [showGeminiHelp, setShowGeminiHelp] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [ytKeyVisible, setYtKeyVisible] = useState(false);
  const [gKeyVisible, setGKeyVisible] = useState(false);
  const [ytKeyError, setYtKeyError] = useState('');
  const [gKeyError, setGKeyError] = useState('');

  useEffect(() => {
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      const state = useAppStore.getState();
      setYtKey(state.youtubeApiKey || '');
      setGKey(state.geminiApiKey || '');
    });
    
    setYtKey(youtubeApiKey || '');
    setGKey(geminiApiKey || '');

    return () => {
      unsubscribe();
    }
  }, [youtubeApiKey, geminiApiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setYtKeyError('');
    setGKeyError('');
    let isValid = true;

    if (!ytKey.trim()) {
      setYtKeyError('YouTube API Key is required.');
      isValid = false;
    }
    if (!gKey.trim()) {
      setGKeyError('Gemini API Key is required.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

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

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="youtube-api-key" className="block text-lg font-medium text-white">YouTube Data API Key</label>
              <p className="text-sm text-gray-400 mt-1 mb-3">Required to fetch comments from YouTube videos.</p>
              <div className="relative">
                <input
                  id="youtube-api-key"
                  type={ytKeyVisible ? 'text' : 'password'}
                  value={ytKey}
                  onChange={(e) => setYtKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm pr-10"
                  placeholder="Enter your YouTube API Key"
                />
                <button
                  type="button"
                  onClick={() => setYtKeyVisible(!ytKeyVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  aria-label="Toggle YouTube API key visibility"
                >
                  {ytKeyVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {ytKeyError && <p className="text-red-400 text-xs mt-1">{ytKeyError}</p>}
              <button type="button" onClick={() => setShowYtHelp(true)} className="text-xs text-blue-400 hover:underline mt-2">Where do I find this?</button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <label htmlFor="gemini-api-key" className="block text-lg font-medium text-white">Google Gemini API Key</label>
              <p className="text-sm text-gray-400 mt-1 mb-3">Required to analyze and categorize comments.</p>
              <div className="relative">
                <input
                  id="gemini-api-key"
                  type={gKeyVisible ? 'text' : 'password'}
                  value={gKey}
                  onChange={(e) => setGKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm pr-10"
                  placeholder="Enter your Gemini API Key"
                />
                <button
                  type="button"
                  onClick={() => setGKeyVisible(!gKeyVisible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                  aria-label="Toggle Gemini API key visibility"
                >
                  {gKeyVisible ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {gKeyError && <p className="text-red-400 text-xs mt-1">{gKeyError}</p>}
              <button type="button" onClick={() => setShowGeminiHelp(true)} className="text-xs text-blue-400 hover:underline mt-2">Where do I find this?</button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="block text-lg font-medium text-white">Analysis Settings</h3>
              <p className="text-sm text-gray-400 mt-1 mb-3">Control how many comments are fetched for analysis.</p>
              <div>
                <label htmlFor="comment-limit" className="block text-sm font-medium text-gray-400 mb-2">
                  Maximum comments to analyze:
                </label>
                <select
                  id="comment-limit"
                  value={commentLimit}
                  onChange={(e) => actions.setCommentLimit(Number(e.target.value))}
                  className="bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
                >
                  {COMMENT_LIMIT_OPTIONS.map((limit: number) => (
                    <option key={limit} value={limit}>
                      {limit.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={() => setShowPricing(true)} className="text-sm text-gray-400 hover:underline">Important: API Usage & Pricing Info</button>
              <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
              >
                  {saved ? 'Saved!' : 'Save Settings'}
              </button>
          </div>
        </form>
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