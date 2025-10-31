import React from 'react';

interface ErrorPanelProps {
  error: string | null;
  onRetry: () => void;
  onReset: () => void;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ error, onRetry, onReset }) => {
  return (
    <div className="text-center p-4 bg-red-900 bg-opacity-50 border border-red-700 rounded-md">
      <h3 className="text-lg font-bold text-red-300">An Error Occurred</h3>
      <p className="text-red-400 my-2">{error || 'An unknown error occurred.'}</p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Retry
        </button>
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ErrorPanel;
