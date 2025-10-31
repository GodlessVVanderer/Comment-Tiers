
import React from 'react';
import { useAppStore } from '../../src/store';
import { COMMENT_LIMIT_OPTIONS } from '../../src/constants';
import { WandIcon } from '../../src/components/Icons';

export const IdlePanel = () => {
  const { commentLimit, setCommentLimit, analyze, videoId } = useAppStore();

  const handleAnalyzeClick = () => {
    if (videoId) {
      analyze(videoId);
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <label
          htmlFor="comment-limit"
          className="block text-sm font-medium text-gray-400 mb-1"
        >
          Analyze up to:
        </label>
        <select
          id="comment-limit"
          value={commentLimit}
          onChange={(e) => setCommentLimit(Number(e.target.value))}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {COMMENT_LIMIT_OPTIONS.map((limit) => (
            <option key={limit} value={limit}>
              {limit.toLocaleString()} comments
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAnalyzeClick}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
      >
        <WandIcon className="w-5 h-5" />
        Analyze Comments
      </button>
    </div>
  );
};
