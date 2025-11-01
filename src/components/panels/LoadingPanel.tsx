import React from 'react';
// FIX: Use relative path for module import.
import { useAppStore } from '../../store';
import { LoadingSpinner } from '../Icons';
// FIX: Use relative path for module import.
import { formatEta } from '../../utils';
// FIX: Use relative path for module import.
import { ProgressPhase } from '../../types';

const phaseTextMap: Record<ProgressPhase, string> = {
  fetching: 'Fetching comments from YouTube...',
  filtering: 'Filtering out spam and low-effort comments...',
  analyzing: 'Analyzing comments with Gemini AI...',
  summarizing: 'Generating summaries...',
};

const LoadingPanel = () => {
  const { progress } = useAppStore();
  const { phase, percent, processed, total, etaSeconds } = progress;

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <LoadingSpinner />
      <p className="mt-4 text-lg">{phaseTextMap[phase]}</p>
      <div className="w-full bg-gray-600 rounded-full h-2.5 mt-4">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="mt-2 text-sm text-gray-400 flex justify-between w-full">
        <span>
            {processed !== undefined && total !== undefined ? `${processed.toLocaleString()} / ${total.toLocaleString()}`: `${percent}%`}
        </span>
        <span>{formatEta(etaSeconds)}</span>
      </div>
    </div>
  );
};

export default LoadingPanel;