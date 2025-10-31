// FIX: Remove reference to chrome types which are unavailable in this environment.
// FIX: Add chrome declaration to satisfy TypeScript when types are not available.
declare const chrome: any;

import React from 'react';
import { useAppStore } from '../../store';

const ConfigErrorPanel = () => {
  const { configError } = useAppStore();

  const handleOpenSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    }
  };

  return (
    <div className="text-center p-4 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-md">
      <h3 className="text-lg font-bold text-yellow-300">Configuration Required</h3>
      <p className="text-yellow-400 my-2">
        {configError || "Please set your API keys in the extension settings."}
      </p>
      <button
        onClick={handleOpenSettings}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-2"
      >
        Open Settings
      </button>
    </div>
  );
};

export default ConfigErrorPanel;