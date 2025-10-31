import React from 'react';
// FIX: Use relative paths for imports
import { useAppStore } from '../../store';
import { COMMENT_LIMIT_OPTIONS, DEFAULT_COMMENT_LIMIT } from '../../constants';

const IdlePanel = () => {
  const { actions } = useAppStore();

  const handleStartAnalysis = (limit: number) => {
    actions.setCommentLimit(limit);
    actions.analyze();
  };

  return (
    <div className="text-center p-8">
      <p className="mb-4 text-lg">Select the number of comments to analyze and begin.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {COMMENT_LIMIT_OPTIONS.map(limit => (
           <button
             key={limit}
             onClick={() => handleStartAnalysis(limit)}
             className={`font-bold py-2 px-5 rounded-md transition-colors duration-200 ${
                limit === DEFAULT_COMMENT_LIMIT 
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
             }`}
           >
             Analyze {limit / 1000}k
           </button>
        ))}
      </div>
       <div className="mt-6 flex justify-center items-center gap-2">
          <button onClick={() => useAppStore.getState().actions.togglePricingModal()} className="text-xs text-gray-400 hover:underline">API Usage Info</button>
      </div>
    </div>
  );
};

export default IdlePanel;
