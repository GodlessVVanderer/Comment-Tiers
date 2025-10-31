import React from 'react';

interface ApiKeyHelpModalProps {
  onClose: () => void;
}

const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">How to get a YouTube API Key</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a>.</li>
          <li>Create a new project.</li>
          <li>Navigate to "APIs & Services" &gt; "Dashboard".</li>
          <li>Click "+ ENABLE APIS AND SERVICES", search for "YouTube Data API v3", and enable it.</li>
          <li>Go to "Credentials", click "+ CREATE CREDENTIALS", and choose "API key".</li>
          <li>Copy the generated API key and paste it into the settings.</li>
        </ol>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ApiKeyHelpModal;
