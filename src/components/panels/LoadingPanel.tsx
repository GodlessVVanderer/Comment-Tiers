import React from 'react';
// FIX: Use relative paths for imports
import { useAppStore } from '../../store';
import { formatEta } from '../../utils';
import { LoadingSpinner } from '../Icons';

const LoadingPanel = () => {
  const { progress } = useAppStore();

  const phaseText: Record<string, string> = {
      fetching: `Fetching comments... (${progress.processed}/${progress.total})`,
      filtering: 'Filtering comments...',
      analyzing: `Analyzing Batch ${progress.processed} of ${progress.total}...`,
      summarizing: 'Generating summaries...',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoadingSpinner className="w-12 h-12 mb-4" />
      <p className="text-lg mb-2">{phaseText[progress.phase] || 'Processing...'}</p>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress.percent}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-400 mt-2">{formatEta(progress.etaSeconds)}</p>
    </div>
  );
};

export default LoadingPanel;
