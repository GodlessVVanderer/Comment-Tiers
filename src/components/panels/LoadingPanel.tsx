import React from 'react';
import { useStore } from '../../store';
import { LoaderIcon } from '../Icons';
import { formatDuration } from '../../utils';

const statusMessages: Record<string, string> = {
  fetching: 'Fetching comments from YouTube...',
  filtering: 'Filtering out spam and duplicates...',
  analyzing: 'Analyzing comments with Gemini...',
};

export const LoadingPanel: React.FC = () => {
    const { status, progress } = useStore();
    const message = statusMessages[status] || 'Processing...';

    const renderProgressBar = () => {
        if (!progress) return null;
        
        const percentage = Math.round(progress.percentage);
        const eta = progress.etaSeconds ? ` (ETA: ${formatDuration(progress.etaSeconds)})` : '';
        const batchInfo = progress.batch && progress.totalBatches ? ` (Batch ${progress.batch}/${progress.totalBatches})` : '';

        return (
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
                <p className="text-xs text-gray-400 text-center mt-1">{percentage}%{batchInfo}{eta}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            <LoaderIcon className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="mt-4 text-lg font-semibold text-white">{message}</p>
            {renderProgressBar()}
        </div>
    );
};
