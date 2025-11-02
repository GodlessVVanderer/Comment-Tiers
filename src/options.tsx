/// <reference types="chrome" />
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import YouTubeApiKeyHelpModal from './components/YouTubeApiKeyHelpModal';
import './index.css';

const Options: React.FC = () => {
    const [youtubeApiKey, setYoutubeApiKey] = useState('');
    const [status, setStatus] = useState('');
    const [isGeminiHelpOpen, setIsGeminiHelpOpen] = useState(false);
    const [isYouTubeHelpOpen, setIsYouTubeHelpOpen] = useState(false);

    useEffect(() => {
        // Load keys from storage
        chrome.storage.sync.get(['youtubeApiKey'], (result) => {
            if (result.youtubeApiKey) {
                setYoutubeApiKey(result.youtubeApiKey);
            }
        });
    }, []);

    const saveKeys = () => {
        // Note: The Gemini API key is not saved here, as per guidelines to use process.env.
        chrome.storage.sync.set({ youtubeApiKey }, () => {
            setStatus('Settings saved!');
            setTimeout(() => setStatus(''), 2000);
        });
    };

    return (
        <div className="p-8 max-w-lg mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="youtube-key" className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube Data API Key
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="youtube-key"
                            type="password"
                            value={youtubeApiKey}
                            onChange={(e) => setYoutubeApiKey(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your YouTube API Key"
                        />
                         <button onClick={() => setIsYouTubeHelpOpen(true)} className="text-sm text-blue-600 hover:underline">Help</button>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                     <h4 className="font-semibold text-blue-800">Google Gemini API Key</h4>
                     <p className="text-sm text-blue-700 mt-1">
                         The Gemini API key is configured at build time and does not need to be set here. For more information on acquiring a key,{' '}
                         <button onClick={() => setIsGeminiHelpOpen(true)} className="font-semibold text-blue-600 hover:underline">click here</button>.
                     </p>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={saveKeys}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                    {status && <p className="text-green-600">{status}</p>}
                </div>
            </div>

            <GeminiApiKeyHelpModal isOpen={isGeminiHelpOpen} onClose={() => setIsGeminiHelpOpen(false)} />
            <YouTubeApiKeyHelpModal isOpen={isYouTubeHelpOpen} onClose={() => setIsYouTubeHelpOpen(false)} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);
