import React from 'react';

interface GeminiApiKeyHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GeminiApiKeyHelpModal: React.FC<GeminiApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">How to get a Gemini API Key</h2>
            <div className="space-y-3 text-gray-600">
                <p>To use this extension, you need an API key for the Google Gemini API.</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Go to the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>.</li>
                    <li>Sign in with your Google account if you haven't already.</li>
                    <li>Click on the "Create API key" button.</li>
                    <li>Copy the generated API key.</li>
                    <li>Paste it into the API key field in the extension's options page.</li>
                </ol>
                <p className="text-sm text-gray-500">
                    <strong>Note:</strong> Your API key is stored locally and securely in your browser's storage.
                </p>
                 <p className="text-sm text-gray-500">
                    Usage of the Gemini API may be subject to pricing. Please check the 
                    <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> official pricing page</a> for details.
                </p>
            </div>
            <div className="text-right mt-6">
              <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Got it</button>
            </div>
          </div>
        </div>
    );
};

export default GeminiApiKeyHelpModal;
