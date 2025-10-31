import React from 'react';
import { XIcon } from '@/components/Icons';

interface ApiKeyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-gray-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white">How to Get a YouTube Data API Key</h2>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-sm">
            <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a>.</li>
            <li>Select a project or create a new one.</li>
            <li>Click "+ CREATE CREDENTIALS" at the top and select "API key".</li>
            <li>Copy the generated API key.</li>
            <li>**Important:** Enable the "YouTube Data API v3" for your project in the <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">API Library</a>.</li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-md">
            <h3 className="font-semibold text-yellow-300">Security Best Practice</h3>
            <p className="text-xs text-yellow-300/80 mt-1">To prevent misuse, you should restrict your API key. Click on your new key in the console, and under "Application restrictions," select "HTTP referrers (web sites)" and add an entry for `https://www.youtube.com/*`.</p>
        </div>
      </div>
    </div>
  );
};
