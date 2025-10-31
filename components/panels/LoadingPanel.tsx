
import React from 'react';
import { useAppStore } from '../../src/store';
import { LoaderIcon } from '../../src/components/Icons';

const statusMessages: Record<string, string> = {
  fetching: 'Fetching comments from YouTube...',
  filtering: 'Filtering out spam and irrelevant comments...',
  analyzing: 'Analyzing comments with AI...',
};

export const LoadingPanel = () => {
  const { status, progress } = useAppStore();

  const percentage =
    progress.total > 0
      ? Math.round((progress.processed / progress.total) * 100)
      : 0;

  return (
    <div className="mt-6 text-center">
      <div className="flex justify-center items-center mb-4">
        <LoaderIcon className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
      <p className="text-white font-semibold">{statusMessages[status]}</p>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {progress.processed.toLocaleString()} / {progress.total.toLocaleString()}
      </p>
    </div>
  );
};
