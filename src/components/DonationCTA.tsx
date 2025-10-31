import React from 'react';
import { HeartIcon, CoffeeIcon } from './Icons';

const DonationCTA: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center">
      <p className="text-sm text-gray-400">
        Enjoying this tool? Consider supporting its development!
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a
          href="https://github.com/sponsors/YOUR_USERNAME" // Replace with your link
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-pink-400 hover:text-pink-300"
        >
          <HeartIcon className="mr-1" /> Sponsor on GitHub
        </a>
        <a
          href="https://www.buymeacoffee.com/YOUR_USERNAME" // Replace with your link
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-yellow-400 hover:text-yellow-300"
        >
          <CoffeeIcon className="mr-1" /> Buy Me a Coffee
        </a>
      </div>
    </div>
  );
};

export default DonationCTA;
