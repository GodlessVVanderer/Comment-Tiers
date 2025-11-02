// FIX: Replaced placeholder text with a functional React component.
import React from 'react';

interface ApiKeyHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">API Key Help</h2>
                <p className="my-4">You need to provide API keys in the extension's options page to use this feature.</p>
                <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">Close</button>
            </div>
        </div>
    );
};

export default ApiKeyHelpModal;
