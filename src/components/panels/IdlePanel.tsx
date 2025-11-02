import React from 'react';

interface IdlePanelProps {
    onAnalyze: () => void;
    isLoading: boolean;
}

const IdlePanel: React.FC<IdlePanelProps> = ({ onAnalyze, isLoading }) => {
    return (
        <div className="text-center p-8">
            <h2 className="text-lg font-semibold">Ready to Analyze</h2>
            <p className="text-gray-600 my-4">Click the button below to start analyzing comments on the current YouTube video page.</p>
            <button
                onClick={onAnalyze}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400"
            >
                {isLoading ? "Starting..." : "Analyze Comments"}
            </button>
        </div>
    );
};

export default IdlePanel;
