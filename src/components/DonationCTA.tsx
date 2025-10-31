import React from 'react';
import { HeartIconOutline, CoffeeIcon } from './Icons';

export const DonationCTA = () => {
    return (
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-center">
            <h3 className="font-semibold text-white">Enjoying this tool?</h3>
            <p className="text-sm text-gray-400 mt-1">
                Consider supporting its development. It helps motivate the creation of more open-source tools.
            </p>
            <div className="flex justify-center gap-4 mt-4">
                <a href="https://github.com/sponsors/google" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm bg-pink-600/20 text-pink-300 border border-pink-500/50 rounded-md hover:bg-pink-600/40 transition-colors">
                    <HeartIconOutline className="w-5 h-5" />
                    Sponsor on GitHub
                </a>
                <a href="https://www.buymeacoffee.com/google" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-600/20 text-yellow-300 border border-yellow-500/50 rounded-md hover:bg-yellow-600/40 transition-colors">
                    <CoffeeIcon className="w-5 h-5" />
                    Buy Me a Coffee
                </a>
            </div>
        </div>
    );
};
