import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ApiKeyHelpModal from './components/ApiKeyHelpModal';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import './style.css';

const Options = () => {
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [status, setStatus] = useState('');
  const [isYoutubeHelpVisible, setYoutubeHelpVisible] = useState(false);
  const [isGeminiHelpVisible, setGeminiHelpVisible] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['youtubeApiKey', 'geminiApiKey'], (result) => {
      if (result.youtubeApiKey) {
        setYoutubeApiKey(result.youtubeApiKey);
      }
      if (result.geminiApiKey) {
        setGeminiApiKey(result.geminiApiKey);
      }
    });
  }, []);

  const saveKeys = () => {
    chrome.storage.sync.set({ youtubeApiKey, geminiApiKey }, () => {
      setStatus('API keys saved successfully!');
      setTimeout(() => setStatus(''), 3000);
    });
  };

  return (
    <div className="w-full h-full p-8 bg-gray-900 text-gray-300 font-sans flex items-center justify-center">
      <div className="w-[500px]">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        
        <div className="mb-6">
          <label htmlFor="youtube-api-key" className="block text-sm font-medium text-gray-400 mb-2">YouTube Data API Key</label>
          <div className="flex items-center">
            <input
              id="youtube-api-key"
              type="password"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={youtubeApiKey}
              onChange={(e) => setYoutubeApiKey(e.target.value)}
            />
            <button onClick={() => setYoutubeHelpVisible(true)} className="ml-2 text-blue-400 hover:underline flex-shrink-0">Help</button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-400 mb-2">Google AI Gemini API Key</label>
          <div className="flex items-center">
            <input
              id="gemini-api-key"
              type="password"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
            />
            <button onClick={() => setGeminiHelpVisible(true)} className="ml-2 text-blue-400 hover:underline flex-shrink-0">Help</button>
          </div>
        </div>
        
        <button
          onClick={saveKeys}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Save Keys
        </button>

        {status && <p className="text-green-400 text-sm mt-4 text-center">{status}</p>}
      </div>
      
      {isYoutubeHelpVisible && <ApiKeyHelpModal onClose={() => setYoutubeHelpVisible(false)} />}
      {isGeminiHelpVisible && <GeminiApiKeyHelpModal onClose={() => setGeminiHelpVisible(false)} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
