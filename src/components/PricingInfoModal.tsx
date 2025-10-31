import React from 'react';
import { XIcon } from '@/components/Icons';

interface PricingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-gray-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white">API Usage & Pricing</h2>
        <p className="text-sm text-gray-400 mt-2">
            This extension requires your own API keys for the YouTube Data API and Google Gemini API.
            Usage of these APIs is billed directly to your Google Cloud account and is not controlled by this extension.
        </p>
        <div className="mt-4 text-xs space-y-1">
            <p>
                - The <strong className="text-white">YouTube Data API</strong> has a free daily quota which is usually sufficient for personal use.
            </p>
            <p>
                - The <strong className="text-white">Google Gemini API</strong> (via AI Studio) also has a free tier. Heavy usage may incur costs.
            </p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
            Please consult the official pricing pages for <a href="https://cloud.google.com/youtube/data/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">YouTube</a> and <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Gemini</a> for the most up-to-date information.
        </p>
      </div>
    </div>
  );
};
