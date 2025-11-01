import React from 'react';

const ConfigErrorPanel: React.FC = () => {
  const handleOpenSettings = () => {
    // @ts-ignore
    if (chrome.runtime && chrome.runtime.openOptionsPage) {
      // @ts-ignore
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <div className="text-center p-8 bg-yellow-900 bg-opacity-30 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">Configuration Error</h2>
      <p className="text-yellow-300 mb-6">
        Please set your YouTube and Gemini API keys in the extension settings.
      </p>
      <button
        onClick={handleOpenSettings}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Open Settings
      </button>
    </div>
  );
};

export default ConfigErrorPanel;
