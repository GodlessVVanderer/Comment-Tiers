import React from 'react';

interface ErrorPanelProps {
    error: string | null;
    onRetry: () => void;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ error, onRetry }) => {
    return (
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800">An Error Occurred</h2>
            <p className="text-red-600 my-4">{error || 'An unknown error occurred.'}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
            >
                Try Again
            </button>
        </div>
    );
};

export default ErrorPanel;
