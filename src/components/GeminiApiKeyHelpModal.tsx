import React from 'react';
import { CloseIcon } from './Icons';

interface GeminiApiKeyHelpModalProps {
  onClose: () => void;
}

const GeminiApiKeyHelpModal: React.FC<GeminiApiKeyHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <h3 className="text-xl font-bold mb-4">How to get your Google Gemini API Key</h3>
        <div className="text-sm text-gray-300 space-y-3">
          <p>
            You can get a free API key from Google AI Studio. This key is necessary for the extension to analyze comments.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>.</li>
            <li>Click on "Create API key in new project".</li>
            <li>Copy the generated API key.</li>
            <li>Paste it into the "Google Gemini API Key" field in the extension settings.</li>
          </ol>
          <p className="text-xs text-yellow-400">
            <strong>Important:</strong> Keep your API key secure. Do not share it publicly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiApiKeyHelpModal;
