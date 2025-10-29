import React from 'react';
import { HeartIcon, CoffeeIcon } from './Icons';

export const DonationCTA: React.FC = () => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-5 shadow-lg text-center">
      <h3 className="text-lg font-semibold text-white mb-2">Enjoying Comment Tiers?</h3>
      <p className="text-gray-400 mb-4 text-sm max-w-md mx-auto">
        This tool is open-source and free to use. If you find it helpful, please consider supporting its continued development.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="https://github.com/sponsors/google"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500"
        >
          <HeartIcon className="w-5 h-5 text-pink-400" />
          Sponsor on GitHub
        </a>
        <a
          href="https://www.buymeacoffee.com/placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500"
        >
          <CoffeeIcon className="w-5 h-5 text-yellow-400" />
          Buy Me a Coffee
        </a>
      </div>
    </div>
  );
};
