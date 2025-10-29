import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useAppStore } from './store';
import './style.css';
import { ApiKeyHelpModal } from './components/ApiKeyHelpModal';
import { GeminiApiKeyHelpModal } from './components/GeminiApiKeyHelpModal';
import { KeyIcon, SparklesIcon, QuestionMarkCircleIcon } from './components/Icons';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

const Options: React.FC = () => {
  const { youtubeApiKey, geminiApiKey, initialize } = useAppStore();
  const [ytKey, setYtKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [isYtHelpOpen, setIsYtHelpOpen] = useState(false);
  const [isGeminiHelpOpen, setIsGeminiHelpOpen] = useState(false);

  useEffect(() => {
    // Initialize store to load keys
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (youtubeApiKey) setYtKey(youtubeApiKey);
    if (geminiApiKey) setGeminiKey(geminiApiKey);
  }, [youtubeApiKey, geminiApiKey]);

  const handleSave = () => {
    setSaveStatus('saving');
    chrome.storage.local.set({ youtubeApiKey: ytKey, geminiApiKey: geminiKey }, () => {
      // Notify other parts of the extension that keys have updated
      chrome.runtime.sendMessage({ action: 'keys-updated' });
      
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
    });
  };

  return (
    <>
      <div className="font-sans p-8 text-gray-200 bg-gray-900 min-h-screen">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Comment Analyzer Options</h1>
          <p className="mt-2 text-gray-400">
            Configure your API keys here. Your keys are stored securely in your browser's local storage.
          </p>

          <div className="mt-8 space-y-6">
            {/* YouTube API Key */}
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <label htmlFor="youtube-api-key" className="flex items-center text-lg font-semibold text-white">
                <KeyIcon className="w-6 h-6 mr-2 text-red-400" />
                YouTube Data API Key
              </label>
              <div className="flex items-center mt-2">
                <input
                  id="youtube-api-key"
                  type="password"
                  value={ytKey}
                  onChange={(e) => setYtKey(e.target.value)}
                  placeholder="Enter your YouTube API key"
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500"
                />
                <button onClick={() => setIsYtHelpOpen(true)} className="ml-2 text-gray-400 hover:text-white">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Gemini API Key */}
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <label htmlFor="gemini-api-key" className="flex items-center text-lg font-semibold text-white">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400" />
                Google Gemini API Key
              </label>
               <div className="flex items-center mt-2">
                <input
                  id="gemini-api-key"
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                 <button onClick={() => setIsGeminiHelpOpen(true)} className="ml-2 text-gray-400 hover:text-white">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`w-full py-3 font-bold rounded-lg transition-colors ${
                saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
              disabled={saveStatus !== 'idle'}
            >
              {saveStatus === 'idle' && 'Save Keys'}
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'saved' && 'Saved!'}
            </button>
          </div>
        </div>
      </div>
      <ApiKeyHelpModal isOpen={isYtHelpOpen} onClose={() => setIsYtHelpOpen(false)} />
      <GeminiApiKeyHelpModal isOpen={isGeminiHelpOpen} onClose={() => setIsGeminiHelpOpen(false)} />
    </>
  );
};

const initialize = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error("Could not find root element for options page.");
    }
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