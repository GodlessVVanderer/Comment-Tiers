declare const chrome: any;

import React from 'react';
import { useAppStore } from '../../store';

const ErrorPanel = () => {
  const { error, actions } = useAppStore();

  if (!error) return null;

  const getErrorMessage = () => {
    switch (error.code) {
      case 'YOUTUBE_API_KEY':
        return "There's an issue with your YouTube API Key. It might be invalid, expired, or have exceeded its quota. Please check your key in the extension settings.";
      case 'GEMINI_API_KEY':
        return "There's an issue with your Gemini API Key. It might be invalid or your billing account may have issues. Please check your key in the extension settings.";
      case 'GEMINI_API_FAILURE':
        return `An error occurred while communicating with the Gemini API: ${error.message}`;
      default:
        return `An unexpected error occurred: ${error.message}`;
    }
  };
  
  const handleOpenSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    }
  };


  return (
    <div className="text-center p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-md">
      <h3 className="text-lg font-bold text-red-300">Analysis Failed</h3>
      <p className="text-red-400 my-2">
        {getErrorMessage()}
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={actions.reset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Try Again
        </button>
        {(error.code === 'YOUTUBE_API_KEY' || error.code === 'GEMINI_API_KEY') && (
            <button
                onClick={handleOpenSettings}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
            >
                Open Settings
            </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPanel;