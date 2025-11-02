import React from 'react';
import { LoaderIcon } from '../Icons';

const LoadingPanel: React.FC = () => {
    return (
        <div className="text-center p-8 flex flex-col items-center justify-center">
            <LoaderIcon className="w-12 h-12 text-blue-600" />
            <h2 className="text-lg font-semibold mt-4">Analyzing Comments...</h2>
            <p className="text-gray-600 my-2">This may take a few moments.</p>
        </div>
    );
};

export default LoadingPanel;
