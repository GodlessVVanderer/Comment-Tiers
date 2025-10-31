import React from 'react';

const ConfigErrorPanel = () => {
  return (
    <div className="text-center p-4 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-md">
      <h3 className="text-lg font-bold text-yellow-300">Configuration Error</h3>
      <p className="text-yellow-400 my-2">
        Please set your YouTube and Gemini API keys in the extension settings.
      </p>
      <button
        onClick={() => chrome.runtime.sendMessage({ action: 'openOptionsPage' })}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-2"
      >
        Open Settings
      </button>
    </div>
  );
};

export default ConfigErrorPanel;
