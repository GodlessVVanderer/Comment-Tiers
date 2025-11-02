import React from 'react';

interface PricingInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold">Pricing Information</h2>
            <p className="my-2">Usage of the Gemini API may incur costs. Please refer to the official Google AI pricing page for details.</p>
            <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Pricing</a>
            <div className="text-right mt-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
    );
};

export default PricingInfoModal;
