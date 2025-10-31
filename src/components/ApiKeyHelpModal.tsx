import React from 'react';
import { CloseIcon, ExternalLinkIcon } from './Icons';

interface ApiKeyHelpModalProps {
  onClose: () => void;
}

export const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-300 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">How to Get a YouTube API Key</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <p>
            To use this extension, you need a YouTube Data API v3 key. This allows the extension to read public comment data. You are responsible for any costs associated with its use.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a>.</li>
            <li>Create a new project (or select an existing one).</li>
            <li>In the sidebar, navigate to "APIs & Services" &rarr; "Library".</li>
            <li>Search for "YouTube Data API v3" and enable it.</li>
            <li>Go to "APIs & Services" &rarr; "Credentials".</li>
            <li>Click "Create Credentials" and select "API key".</li>
            <li>Copy the generated key and paste it into the extension's settings.</li>
          </ol>
          <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <h3 className="font-semibold text-yellow-300">Security Best Practice</h3>
            <p className="text-yellow-200 mt-1">
              To prevent misuse, you should restrict your API key. Click on your key in the Credentials list, and under "Application restrictions", select "HTTP referrers (web sites)". Add a new entry for <code className="bg-gray-700 px-1 rounded">https://www.youtube.com/*</code>.
            </p>
          </div>
          <a
            href="https://developers.google.com/youtube/v3/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:underline"
          >
            Full Google Documentation <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
