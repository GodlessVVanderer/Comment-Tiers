
// FIX: Add chrome type declaration to fix build errors due to missing @types/chrome.
declare const chrome: any;

import React from 'react';
import { useAppStore } from '../../src/store';

export const ConfigErrorPanel = () => {
  const { configError } = useAppStore();

  const openOptions = () => {
    chrome.runtime.sendMessage({ action: 'open-options-page' });
  };

  return (
    <div className="mt-6 text-center p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
      <h3 className="font-semibold text-yellow-300">Configuration Required</h3>
      <p className="text-sm text-yellow-200 mt-1">
        {configError || 'Please set your API keys in the extension options.'}
      </p>
      <button
        onClick={openOptions}
        className="mt-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors"
      >
        Open Settings
      </button>
    </div>
  );
};
