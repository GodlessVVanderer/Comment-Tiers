
// Fix: Add Chrome types reference to resolve 'Cannot find name chrome' error.
/// <reference types="chrome" />
import React from 'react';

const ConfigErrorPanel: React.FC = () => {
    const openOptionsPage = () => {
        chrome.runtime.openOptionsPage();
    };

    return (
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800">Configuration Required</h2>
            <p className="text-yellow-700 my-4">
                Please set your Gemini and YouTube API keys in the extension's options page to proceed.
            </p>
            <button
                onClick={openOptionsPage}
                className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
            >
                Open Options
            </button>
        </div>
    );
};

export default ConfigErrorPanel;