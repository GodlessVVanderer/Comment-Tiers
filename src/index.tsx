// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const Popup = () => {
  const handleOpenSettings = () => {
    if (chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <div className="w-[300px] p-4 bg-gray-900 text-gray-300 font-sans">
      <h1 className="text-lg font-bold text-white">Comment Analyzer</h1>
      <p className="text-sm text-gray-400 mt-2">
        To analyze comments, navigate to a YouTube video page. The tool will appear below the video player.
      </p>
      
      <button
        onClick={handleOpenSettings}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
      >
        Open Settings
      </button>

      <p className="text-xs text-gray-500 mt-4">
        You must add your API keys in the settings before the tool will work.
      </p>
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
      <Popup />
    </React.StrictMode>
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}