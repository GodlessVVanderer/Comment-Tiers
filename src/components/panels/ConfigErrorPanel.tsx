/// <reference types="chrome" />
import React from 'react';

const ConfigErrorPanel: React.FC = () => {
    const openOptionsPage = () => {
        chrome.runtime.openOptionsPage();
    };

    return (
        <div className="p-4 text-center bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Configuration Error</h3>
            <p className="text-yellow-700 mb-4">
                It seems there's an issue with your API keys. Please check them in the settings.
            </p>
            <button
                onClick={openOptionsPage}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600"
            >
                Open Settings
            </button>
        </div>
    );
};

export default ConfigErrorPanel;
