// FIX: Remove reference to chrome types which are unavailable in this environment.
// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

import React from 'react';
import { useAppStore } from '../../store';

const ErrorPanel = () => {
  const { error, actions } = useAppStore();

  const handleOpenSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    }
  };

  const showCheckKeysButton = error?.code?.includes('YOUTUBE') || error?.code?.includes('GEMINI') || error?.message?.includes('API key');

  return (
    <div className="text-center p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-md">
      <h3 className="text-lg font-bold text-red-300">An Error Occurred</h3>
      <p className="text-red-400 my-2">{error?.message || 'An unknown error occurred.'}</p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={actions.analyze}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Retry
        </button>
        <button
          onClick={actions.reset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Back
        </button>
        {showCheckKeysButton && (
            <button
                onClick={handleOpenSettings}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md"
            >
                Check API Keys
            </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPanel;