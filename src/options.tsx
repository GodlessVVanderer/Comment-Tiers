import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { useStore } from '@/store';
import './style.css';

const Options = () => {
    const { 
      youtubeApiKey: storedYoutubeKey, 
      geminiApiKey: storedGeminiKey, 
      setYoutubeApiKey: setStoredYoutubeKey, 
      setGeminiApiKey: setStoredGeminiKey,
      initialize
    } = useStore();
    
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [youtubeApiKey, setYoutubeApiKey] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Initialize loads keys from storage into the store
        initialize();
    }, [initialize]);
    
    useEffect(() => {
        if (storedYoutubeKey) setYoutubeApiKey(storedYoutubeKey);
        if (storedGeminiKey) setGeminiApiKey(storedGeminiKey);
    }, [storedYoutubeKey, storedGeminiKey]);

    const saveOptions = () => {
        setStoredYoutubeKey(youtubeApiKey);
        setStoredGeminiKey(geminiApiKey);
        setStatus('Options saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-gray-900 text-gray-300 font-sans flex justify-center">
            <div className="w-full max-w-lg">
                <h1 className="text-2xl font-bold text-white mb-6">Comment Tiers Settings</h1>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-300 mb-1">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            id="geminiApiKey"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Required for analyzing comments. Get one from{' '}
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Google AI Studio
                            </a>.
                        </p>
                    </div>
                    
                    <div>
                        <label htmlFor="youtubeApiKey" className="block text-sm font-medium text-gray-300 mb-1">
                            YouTube Data API v3 Key
                        </label>
                        <input
                            type="password"
                            id="youtubeApiKey"
                            value={youtubeApiKey}
                            onChange={(e) => setYoutubeApiKey(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Required for fetching comments. Get one from the{' '}
                            <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Google Cloud Console
                            </a>.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center">
                    <button
                        onClick={saveOptions}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                    >
                        Save Keys
                    </button>
                    {status && <p className="ml-4 text-sm text-green-400">{status}</p>}
                </div>
            </div>
        </div>
    );
};


const initialize = () => {
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
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
