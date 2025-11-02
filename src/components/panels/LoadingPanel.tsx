import React from 'react';

const LoadingPanel: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Analyzing comments, please wait...</p>
            <p className="mt-2 text-sm text-gray-500">This might take a moment.</p>
        </div>
    );
};

export default LoadingPanel;
