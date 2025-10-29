import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const Popup = () => {
  return (
    <div className="w-[300px] p-4 bg-gray-900 text-gray-300 font-sans">
      <h1 className="text-lg font-bold text-white">Comment Analyzer</h1>
      <p className="text-sm text-gray-400 mt-2">
        Navigate to a YouTube video page. The analysis tool will automatically appear below the video player.
      </p>
      <p className="text-xs text-gray-500 mt-4">
        If it doesn't appear, try refreshing the page. You may need to set your API keys in the extension options.
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