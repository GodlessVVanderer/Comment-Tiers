import React from 'react';
import { CloseIcon, ExternalLinkIcon } from './Icons';

interface GeminiApiKeyHelpModalProps {
  onClose: () => void;
}

export const GeminiApiKeyHelpModal: React.FC<GeminiApiKeyHelpModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-300 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">How to Get a Gemini API Key</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <p>
            This extension uses the Google Gemini API for comment analysis. You need to provide your own key.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.</li>
            <li>Sign in with your Google account.</li>
            <li>Click "Create API key in new project".</li>
            <li>Copy the generated key and paste it into the extension's settings.</li>
          </ol>
          <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <h3 className="font-semibold text-yellow-300">Security Best Practice</h3>
            <p className="text-yellow-200 mt-1">
              API key usage is tied to your Google Cloud project. It's a good idea to monitor usage and set up billing alerts in the associated Cloud project to prevent any surprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
