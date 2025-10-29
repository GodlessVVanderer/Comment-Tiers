
import React from 'react';
import { CloseIcon } from './Icons';

interface GeminiApiKeyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiApiKeyHelpModal: React.FC<GeminiApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
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
        
        <h2 className="text-xl font-bold text-white mb-4">How to Get a Google Gemini API Key</h2>
        
        <p className="mb-4 text-gray-400">
          This tool uses the Gemini API for analysis. You can get a free API key from Google AI Studio.
        </p>

        <ol className="list-decimal list-inside space-y-3 text-sm">
          <li>
            Go to{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:underline font-semibold"
            >
              Google AI Studio
            </a>.
          </li>
          <li>
            Click <strong>"Create API key in new project"</strong> (or use an existing one).
          </li>
          <li>
            Copy the generated API key and paste it into the input field in the app.
          </li>
        </ol>

        <div className="mt-6 text-xs text-gray-500 bg-gray-900/50 p-3 rounded-md">
          <strong>Note:</strong> Your API key is used directly in your browser to communicate with Google's API and is not stored or seen by us. You are responsible for any costs associated with your key.
        </div>

      </div>
    </div>
  );
};
