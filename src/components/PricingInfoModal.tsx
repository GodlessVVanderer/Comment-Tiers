import React from 'react';
import { CloseIcon, QuestionMarkCircleIcon } from './Icons';

interface PricingInfoModalProps {
  onClose: () => void;
}

const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <QuestionMarkCircleIcon className="mr-2" />
          API Usage & Pricing Information
        </h3>
        <div className="space-y-4 text-sm text-gray-300">
            <p>This tool uses the YouTube Data API v3 and the Google Gemini API, which may incur costs based on your usage.</p>
            <div>
                <h4 className="font-bold text-md text-white">YouTube Data API</h4>
                <p>Fetching comments has a quota cost. Typically, fetching 100 comments costs about 1 quota unit. The free daily quota is 10,000 units. Analyzing up to 10k comments should stay within the free tier.</p>
                <a href="https://developers.google.com/youtube/v3/getting-started#quota" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Learn more about YouTube API Quotas.</a>
            </div>
             <div>
                <h4 className="font-bold text-md text-white">Google Gemini API</h4>
                <p>Analyzing comments uses the Gemini model. Costs are based on the number of tokens processed (both input and output). We use `gemini-2.5-flash` for its balance of cost and performance.</p>
                <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Learn more about Gemini API Pricing.</a>
            </div>
            <p className="font-bold">Please monitor your usage in the Google Cloud Console.</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default PricingInfoModal;
