import React from 'react';
import { useAppStore } from '../../store';
import { COMMENT_LIMIT_OPTIONS } from '../../constants';

const IdlePanel = () => {
  const { actions, commentLimit } = useAppStore();

  return (
    <div className="text-center p-8">
      <div className="mb-6">
        <label htmlFor="comment-limit" className="block text-sm font-medium text-gray-400 mb-2">
          Number of comments to analyze:
        </label>
        <select
          id="comment-limit"
          value={commentLimit}
          onChange={(e) => actions.setCommentLimit(Number(e.target.value))}
          className="bg-gray-700 border border-gray-600 rounded-md p-2 text-sm"
        >
          {COMMENT_LIMIT_OPTIONS.map(limit => (
            <option key={limit} value={limit}>
              {limit.toLocaleString()}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => actions.analyze()}
        className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 text-lg'
      >
        Analyze Comments
      </button>
       <div className="mt-6 flex justify-center items-center gap-4">
          <button onClick={() => useAppStore.getState().actions.togglePricingModal()} className="text-xs text-gray-400 hover:underline">API Usage Info</button>
          <span className="text-gray-600">|</span>
           <a href="https://github.com/google/aistudio-web" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:underline">View on GitHub</a>
      </div>
    </div>
  );
};

export default IdlePanel;