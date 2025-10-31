
// FIX: Add chrome type declaration to fix build errors due to missing @types/chrome.
declare const chrome: any;

import React from 'react';
import { useAppStore } from '../../src/store';

export const ErrorPanel = () => {
  const { error, analyze, videoId } = useAppStore();

  const handleRetry = () => {
    if (videoId) {
      analyze(videoId);
    }
  };

  const openOptions = () => {
    chrome.runtime.sendMessage({ action: 'open-options-page' });
  };
  
  return (
    <div className="mt-6 text-center p-4 bg-red-900/30 border border-red-700 rounded-lg">
      <h3 className="font-semibold text-red-300">Analysis Failed</h3>
      <p className="text-sm text-red-200 mt-1">
        {error?.message || 'An unknown error occurred.'}
      </p>
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={handleRetry}
          className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded"
        >
          Retry
        </button>
        {(error?.code.includes('KEY') || error?.code.includes('QUOTA')) && (
            <button
            onClick={openOptions}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded"
          >
            Check API Keys
          </button>
        )}
      </div>
    </div>
  );
};
