// FIX: Replaced placeholder text with a functional React component.
import React from 'react';

const DonationCTA: React.FC = () => {
    return (
        <div className="text-center p-4 border-t mt-4">
            <p className="text-sm text-gray-600">If you find this tool useful, consider supporting its development.</p>
            <a 
                href="https://www.buymeacoffee.com" // Replace with actual link
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
            >
                Buy me a coffee
            </a>
        </div>
    );
};

export default DonationCTA;
