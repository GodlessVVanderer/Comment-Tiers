import React from 'react';
import { CloseIcon, QuestionMarkCircleIcon } from './Icons';

interface ApiKeyHelpModalProps {
  onClose: () => void;
}

const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <QuestionMarkCircleIcon className="mr-2" />
          How to get a YouTube API Key
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a>.</li>
          <li>Create a new project or select an existing one.</li>
          <li>In the search bar, type "YouTube Data API v3" and enable it for your project.</li>
          <li>Go to "APIs & Services" &gt; "Credentials".</li>
          <li>Click "+ CREATE CREDENTIALS" at the top and choose "API key".</li>
          <li>Copy the generated API key.</li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded-md text-yellow-300 text-sm">
          <p className="font-bold">Security Best Practice:</p>
          <p>To prevent misuse, you should restrict your API key. In the credentials settings, choose "HTTP referrers" and add a new entry: <strong>https://www.youtube.com/*</strong></p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ApiKeyHelpModal;
