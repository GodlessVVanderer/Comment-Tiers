import React from 'react';

interface YouTubeApiKeyHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const YouTubeApiKeyHelpModal: React.FC<YouTubeApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800">How to get a YouTube Data API Key</h2>
                <div className="space-y-3 text-gray-600">
                    <p>This extension needs a YouTube Data API v3 key to fetch video details and comments.</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>.</li>
                        <li>Create a new project or select an existing one.</li>
                        <li>From the navigation menu, go to "APIs & Services" &gt; "Library".</li>
                        <li>Search for "YouTube Data API v3" and enable it for your project.</li>
                        <li>Go to "APIs & Services" &gt; "Credentials".</li>
                        <li>Click "Create Credentials" and select "API key".</li>
                        <li>Copy the generated API key and paste it into the extension's options.</li>
                    </ol>
                    <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                        <strong>Important:</strong> It's highly recommended to restrict your API key to prevent unauthorized use. You can find instructions on how to do this in the Google Cloud documentation.
                    </p>
                </div>
                <div className="text-right mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Got it</button>
                </div>
            </div>
        </div>
    );
};

export default YouTubeApiKeyHelpModal;
