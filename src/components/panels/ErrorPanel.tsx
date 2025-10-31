import React from 'react';
import { useStore } from '../../store';

declare const chrome: any;

export const ErrorPanel: React.FC = () => {
  const { error, reset } = useStore();

  const handleOpenOptions = () => {
    chrome.runtime.sendMessage({ action: 'openOptionsPage' });
  };
  
  const isKeyError = error?.code?.includes('INVALID_KEY');

  return (
    <div className="text-center">
      <h3 className="text-lg font-bold text-red-400">Analysis Failed</h3>
      <p className="text-sm text-gray-400 mt-2">{error?.message || 'An unexpected error occurred.'}</p>
      <div className="mt-4 space-x-2">
        <button
          onClick={reset}
          className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md"
        >
          Try Again
        </button>
        {isKeyError && (
             <button
                onClick={handleOpenOptions}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Check API Keys
            </button>
        )}
      </div>
    </div>
  );
};
