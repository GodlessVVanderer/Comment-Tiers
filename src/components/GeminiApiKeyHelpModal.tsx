import React from 'react';
import { XIcon } from './Icons';

interface GeminiApiKeyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiApiKeyHelpModal: React.FC<GeminiApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-gray-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white">How to Get a Gemini API Key</h2>
        <ol className="list-decimal list-inside mt-4 space-y-2 text-sm">
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.</li>
            <li>Log in with your Google account.</li>
            <li>Click "Create API key in new project".</li>
            <li>Copy the generated API key.</li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-md">
            <h3 className="font-semibold text-yellow-300">Security Best Practice</h3>
            <p className="text-xs text-yellow-300/80 mt-1">The free Gemini API has generous limits, but it's wise to monitor your usage. You can do this in the Google Cloud Console for the project that was created, where you can also set up billing alerts if you upgrade to a paid plan.</p>
        </div>
      </div>
    </div>
  );
};
