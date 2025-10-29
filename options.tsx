import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { KeyIcon, SparklesIcon, CheckCircleIcon } from './components/Icons';

// FIX: Declare the chrome object to inform TypeScript about the Chrome Extension APIs.
declare const chrome: any;

const Options: React.FC = () => {
  const [youtubeKey, setYoutubeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], (result) => {
      setYoutubeKey(result.youtubeApiKey || '');
      setGeminiKey(result.geminiApiKey || '');
    });
  }, []);

  const handleSave = () => {
    setStatus('saving');
    chrome.storage.local.set({
      youtubeApiKey: youtubeKey,
      geminiApiKey: geminiKey,
    }, () => {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Comment Tiers Settings
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Save your API keys here. They will be stored securely in your browser.
          </p>
        </header>
        <main className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700/50">
          <div className="space-y-6">
            <div className="relative w-full">
              <label htmlFor="youtube-key" className="block text-sm font-medium text-gray-300 mb-2">YouTube API Key</label>
              <KeyIcon className="absolute left-3 top-[47px] -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="youtube-key"
                type="password"
                value={youtubeKey}
                onChange={(e) => setYoutubeKey(e.target.value)}
                placeholder="Enter YouTube API Key..."
                className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>
            <div className="relative w-full">
              <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
              <SparklesIcon className="absolute left-3 top-[47px] -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="gemini-key"
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter Gemini API Key..."
                className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>
            <div>
              <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                {status === 'saved' ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Saved!
                  </>
                ) : status === 'saving' ? 'Saving...' : 'Save Keys'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);