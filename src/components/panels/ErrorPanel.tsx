import React from 'react';
import { useAppStore } from '../../store';

interface ErrorPanelProps {
    message: string | null;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ message }) => {
    const { actions } = useAppStore();

    return (
        <div className="p-4 text-center bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">An Error Occurred</h3>
            <p className="text-red-700 mb-4">
                {message || "Something went wrong during the analysis."}
            </p>
            <button
                onClick={actions.reset}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
            >
                Try Again
            </button>
        </div>
    );
};

export default ErrorPanel;
