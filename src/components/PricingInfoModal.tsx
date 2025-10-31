import React from 'react';

interface PricingInfoModalProps {
  onClose: () => void;
}

const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-gray-300">
        <h3 className="text-xl font-bold mb-4 text-white">API Usage & Pricing</h3>
        <div className="space-y-4 text-sm">
          <p>This extension uses the YouTube Data API and the Google Gemini API, both of which may incur costs based on your usage.</p>
          <div>
            <h4 className="font-bold">Google Gemini API</h4>
            <p>The Gemini API has a free tier, but usage beyond that is subject to pricing. Analysis is performed using the 'gemini-2.5-flash' model. Please check the official Google AI documentation for the most current pricing details.</p>
            <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              View Gemini Pricing
            </a>
          </div>
          <div>
            <h4 className="font-bold">YouTube Data API v3</h4>
            <p>The YouTube API has a daily quota for requests. If you analyze videos with many comments frequently, you might exceed the free quota. Costs are calculated based on "quota units".</p>
            <a href="https://developers.google.com/youtube/v3/getting-started#quota" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              View YouTube API Quota Info
            </a>
          </div>
          <p className="text-xs text-gray-400">You are responsible for any costs associated with your API keys. This tool is provided as-is, without warranty.</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PricingInfoModal;
