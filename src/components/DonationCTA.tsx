import React from 'react';
import { HeartIcon, CoffeeIcon } from './Icons';

export const DonationCTA = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="text-white font-semibold">Enjoying Comment Tiers?</p>
      <p className="text-gray-400 text-sm mt-1">Consider supporting its development!</p>
      <div className="flex justify-center items-center gap-4 mt-3">
        <a 
            href="https://github.com/sponsors/google" 
            target="_blank" rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
        >
            <HeartIcon className="w-4 h-4 mr-2" />
            Sponsor on GitHub
        </a>
        <a 
            href="https://www.buymeacoffee.com/google" 
            target="_blank" rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm"
        >
            <CoffeeIcon className="w-4 h-4 mr-2" />
            Buy me a coffee
        </a>
      </div>
    </div>
  );
};
