
// Fix: Add Chrome types reference to resolve 'Cannot find name chrome' errors.
/// <reference types="chrome" />
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import YouTubeApiKeyHelpModal from './components/YouTubeApiKeyHelpModal';
import './index.css';

const Options: React.FC = () => {
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [youtubeApiKey, setYoutubeApiKey] = useState('');
    const [status, setStatus] = useState('');
    const [isGeminiHelpOpen, setIsGeminiHelpOpen] = useState(false);
    const [isYouTubeHelpOpen, setIsYouTubeHelpOpen] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(['geminiApiKey', 'youtubeApiKey'], (result) => {
            if (result.geminiApiKey) setGeminiApiKey(result.geminiApiKey);
            if (result.youtubeApiKey) setYoutubeApiKey(result.youtubeApiKey);
        });
    }, []);

    const saveOptions = () => {
        chrome.storage.local.set({
            geminiApiKey,
            youtubeApiKey,
        }, () => {
            setStatus('Options saved.');
            setTimeout(() => setStatus(''), 2000);
        });
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-6">
                <div>
                    <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700">
                        Gemini API Key
                    </label>
                    <div className="mt-1 flex items-center">
                        <input
                            type="password"
                            id="gemini-key"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={geminiApiKey}
                            onChange={(e) => setGeminiApiKey(e.target.value)}
                        />
                        <button onClick={() => setIsGeminiHelpOpen(true)} className="ml-2 text-blue-600 hover:underline text-sm">Help</button>
                    </div>
                </div>

                <div>
                    <label htmlFor="youtube-key" className="block text-sm font-medium text-gray-700">
                        YouTube API Key
                    </label>
                    <div className="mt-1 flex items-center">
                        <input
                            type="password"
                            id="youtube-key"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={youtubeApiKey}
                            onChange={(e) => setYoutubeApiKey(e.target.value)}
                        />
                         <button onClick={() => setIsYouTubeHelpOpen(true)} className="ml-2 text-blue-600 hover:underline text-sm">Help</button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={saveOptions}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Save
                </button>
                {status && <span className="ml-4 text-green-600">{status}</span>}
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