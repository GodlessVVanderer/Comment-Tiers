import React from 'react';
import { useAppStore } from '../../store';

interface ErrorPanelProps {
  error?: string;
  onRetry?: () => void;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ error: propError, onRetry: propOnRetry }) => {
  const { error: storeError, actions } = useAppStore();
  const error = propError || storeError || 'An unknown error occurred.';
  const onRetry = propOnRetry || (() => actions.reset());

  return (
    <div className="text-center p-8 bg-red-900 bg-opacity-30 rounded-lg">
      <h2 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h2>
      <p className="text-red-300 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorPanel;
