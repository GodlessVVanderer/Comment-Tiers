

import React from 'react';
import { CloseIcon } from './Icons';

interface ApiKeyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg p-6 relative text-gray-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-4">How to Get a YouTube API Key</h2>
        
        <p className="mb-4 text-gray-400">
          To analyze comments, this tool needs a YouTube Data API v3 key. It's free for this type of use.
        </p>

        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>
            Go to the{' '}
            <a 
              href="https://console.cloud.google.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:underline font-semibold"
            >
              Google Cloud Console
            </a>.
          </li>
          <li>
            Create a new project (or select an existing one).
          </li>
          <li>
            In the search bar, find and enable the <strong>"YouTube Data API v3"</strong>.
          </li>
          <li>
            Go to "Credentials" (in the left-hand menu under APIs & Services), click <strong>"+ CREATE CREDENTIALS"</strong>, and select <strong>"API key"</strong>.
          </li>
          <li>
            Copy the generated API key and paste it into the input field.
          </li>
        </ol>

        <div className="mt-6 p-3 rounded-md bg-yellow-900/40 border border-yellow-700 text-yellow-300">
            <h4 className="font-bold text-sm mb-1">Security Best Practice</h4>
            <p className="text-xs">
                To prevent misuse, you should restrict your API key. Click on your new key in the Cloud Console, under "Application restrictions," select "HTTP referrers (web sites)," and add an entry for <strong>https://www.youtube.com/*</strong>
            </p>
        </div>

        <div className="mt-4 text-xs text-gray-500 bg-gray-900/50 p-3 rounded-md">
          <strong>Note:</strong> Your API key is used directly in your browser to communicate with YouTube's API and is not stored or seen by us. This application does not provide a fallback key; analysis will only work with a valid key you provide.
        </div>

      </div>
    </div>
  );
};
