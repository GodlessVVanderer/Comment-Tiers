import React from 'react';
import { HeartIcon, CoffeeIcon } from './Icons';

export const DonationCTA: React.FC = () => {
  return (
    <div className="text-center mt-8 p-4 bg-gray-800/60 border border-gray-700/50 rounded-lg">
      <h3 className="text-md font-semibold text-white flex items-center justify-center gap-2">
        <HeartIcon className="w-5 h-5 text-red-400" />
        Enjoying This Tool?
      </h3>
      <p className="text-sm text-gray-400 mt-2 mb-4 max-w-md mx-auto">
        This is a passion project developed in my free time. If it's saved you time or provided value, a small tip would be greatly appreciated and helps keep the project alive!
      </p>
      <a
        href="https://www.buymeacoffee.com/your-username" // Replace with a real link
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-400 transition-transform transform hover:scale-105"
      >
        <CoffeeIcon className="w-5 h-5" />
        Buy Me a Coffee
      </a>
    </div>
  );
};