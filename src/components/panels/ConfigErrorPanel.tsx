import React from 'react';

declare const chrome: any;

export const ConfigErrorPanel: React.FC = () => {
    const handleOpenOptions = () => {
        chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    };

    return (
        <div className="text-center p-4">
            <h3 className="text-lg font-bold text-yellow-400">Configuration Required</h3>
            <p className="text-sm text-gray-400 mt-2">
                Please set your YouTube and Gemini API keys in the extension options to begin.
            </p>
            <div className="mt-4">
                <button
                    onClick={handleOpenOptions}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    Open Settings
                </button>
            </div>
        </div>
    );
};
