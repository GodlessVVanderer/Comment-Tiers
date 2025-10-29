import React from 'react';
import { CloseIcon, ExternalLinkIcon } from './Icons';

interface PricingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg p-6 relative text-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-4">Understanding API Costs</h2>
        
        <p className="mb-4 text-gray-400">
          This tool utilizes Google's Gemini API for comment analysis and the YouTube Data API for fetching comments. While the YouTube API has a generous free daily quota, the primary operational cost comes from the Gemini API, which is billed based on usage.
        </p>

        <div className="space-y-4 text-sm">
            <div>
                <h3 className="font-semibold text-white mb-2">Gemini API Pricing (gemini-2.5-flash)</h3>
                <p className="text-gray-400">
                    The Gemini API charges per "token," which are small pieces of words. Both the data you send (input) and the data you receive (output) are counted.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-gray-300">
                    <li><strong>Input Tokens:</strong> ~$0.35 per 1 million tokens</li>
                    <li><strong>Output Tokens:</strong> ~$0.70 per 1 million tokens</li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-white mb-2">Example Cost Calculation</h3>
                <p className="text-gray-400 mb-2">Let's assume analyzing a video results in processing 100,000 tokens, split evenly between input and output:</p>
                <div className="bg-gray-900/50 p-3 rounded-md text-xs font-mono">
                    <p>Input: 50,000 tokens * ($0.35 / 1,000,000) = $0.0175</p>
                    <p>Output: 50,000 tokens * ($0.70 / 1,000,000) = $0.0350</p>
                    <hr className="border-gray-600 my-1" />
                    <p><strong>Total Estimated Cost: $0.0525</strong></p>
                </div>
            </div>
             <div>
                <a 
                  href="https://ai.google.dev/pricing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1.5"
                >
                  View Official Gemini Pricing
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
            </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 bg-gray-900/50 p-3 rounded-md">
          <strong>Disclaimer:</strong> This is a simplified estimate. Actual costs will vary based on the number of comments, their length, and the complexity of the categories generated. You are responsible for all costs associated with your own API keys.
        </div>

      </div>
    </div>
  );
};