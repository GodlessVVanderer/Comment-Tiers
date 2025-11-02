import React from 'react';

interface GeminiApiKeyHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GeminiApiKeyHelpModal: React.FC<GeminiApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">How to get a Gemini API Key</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>.</li>
                    <li>Click on <strong>"Create API key"</strong>.</li>
                    <li>Copy the generated API key.</li>
                    <li>Paste it into the Gemini API Key field in the extension options.</li>
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

export default GeminiApiKeyHelpModal;
