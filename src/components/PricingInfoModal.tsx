import React from 'react';
import { CloseIcon } from './Icons';

interface PricingInfoModalProps {
  onClose: () => void;
}

const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <h3 className="text-xl font-bold mb-4">API Usage & Pricing Information</h3>
        <div className="text-sm text-gray-300 space-y-4">
          <p>This tool uses two Google APIs, each with its own costs. Please monitor your usage in the Google Cloud Console.</p>
          <div>
            <h4 className="font-bold text-lg text-white mb-2">1. YouTube Data API v3</h4>
            <p>Used to fetch video comments. This has a daily quota.</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Comment fetching (commentThreads.list) costs 1 quota unit per request.</li>
              <li>The default quota is 10,000 units per day, which is enough for ~1 million comments.</li>
              <li>You can view usage and quotas <a href="https://console.cloud.google.com/iam-admin/quotas" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">here</a>.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-white mb-2">2. Google Gemini API</h4>
            <p>Used to analyze and categorize comments. This is a paid service.</p>
             <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Pricing is based on the number of characters sent and received.</li>
                <li>For the 'gemini-2.5-flash' model used in this tool, the cost is very low, but can add up with heavy use.</li>
                <li>Always check the official pricing page for the latest information: <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ai.google.dev/pricing</a>.</li>
                <li>We recommend setting up <a href="https://cloud.google.com/billing/docs/how-to/budgets" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">billing alerts</a> in your Google Cloud project.</li>
            </ul>
          </div>
           <p className="text-xs text-gray-400 italic">Note: Prices and quotas are subject to change by Google. The information here is a guideline and may not be up-to-date.</p>
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
