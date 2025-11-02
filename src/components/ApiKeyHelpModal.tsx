import React from 'react';

interface ApiKeyHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApiKeyHelpModal: React.FC<ApiKeyHelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold">API Key Help</h2>
            <p className="my-2">This is a placeholder for API key help instructions.</p>
            <div className="text-right mt-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
    );
};

export default ApiKeyHelpModal;
