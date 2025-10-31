/// <reference types="chrome" />
import React from 'react';

const ConfigErrorPanel = () => {
  const handleOpenSettings = () => {
    // Fix: Check if chrome runtime is available before sending a message.
    // This resolves the "Cannot find name 'chrome'" TypeScript error by
    // ensuring the code only runs in a browser extension context.
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    }
  };

  return (
    <div className="text-center p-4 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-md">
      <h3 className="text-lg font-bold text-yellow-300">Configuration Error</h3>
      <p className="text-yellow-400 my-2">
        Please set your YouTube and Gemini API keys in the extension settings.
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
