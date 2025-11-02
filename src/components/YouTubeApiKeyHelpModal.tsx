import React from 'react';

interface YouTubeApiKeyHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const YouTubeApiKeyHelpModal: React.FC<YouTubeApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">How to get a YouTube API Key</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Go to the <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>.</li>
                    <li>Create a new project or select an existing one.</li>
                    <li>Navigate to "APIs & Services" &gt; "Library".</li>
                    <li>Search for and enable the "YouTube Data API v3".</li>
                    <li>Go to "APIs & Services" &gt; "Credentials".</li>
                    <li>Click "Create Credentials" &gt; "API key".</li>
                    <li>Copy the key and paste it in the extension options.</li>
                </ol>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default YouTubeApiKeyHelpModal;
