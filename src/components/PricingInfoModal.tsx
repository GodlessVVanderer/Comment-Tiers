import React from 'react';
import { CloseIcon, ExternalLinkIcon } from './Icons';

interface PricingInfoModalProps {
  onClose: () => void;
}

export const PricingInfoModal: React.FC<PricingInfoModalProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-300 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">API Cost Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <p>
            This extension uses the Google Gemini API to analyze comments. While
            Google provides a generous free tier, usage beyond that may incur
            costs. **You are responsible for all costs associated with your
            own API key.**
          </p>
          <div className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
            <h3 className="font-semibold text-white">Example Calculation</h3>
            <p className="mt-1">
              Let's say you analyze 10,000 comments, and the total text sent to
              the AI (the "input tokens") is 500,000 characters.
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-400">
              <li>
                {/* FIX: Corrected model name from 1.5 to 2.5 */}
                Gemini 2.5 Flash (the model used) is priced per character.
              </li>
              <li>
                The cost for this analysis would be a very small fraction of a cent.
              </li>
            </ul>
            <p className="mt-2">
              It is generally very affordable for personal use, but it's important to be aware of the pricing model.
            </p>
          </div>
          <a
            href="https://ai.google.dev/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:underline"
          >
            View Official Gemini API Pricing{' '}
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
