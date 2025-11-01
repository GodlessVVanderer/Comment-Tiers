import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { COMMENT_LIMIT_OPTIONS, DEFAULT_COMMENT_LIMIT } from '../../constants';
import PricingInfoModal from '../PricingInfoModal';
import { InfoIcon } from '../Icons';

interface IdlePanelProps {
  videoId: string;
}

const IdlePanel: React.FC<IdlePanelProps> = ({ videoId }) => {
  const { startAnalysis } = useAppStore(state => state.actions);
  const [commentLimit, setCommentLimit] = useState(DEFAULT_COMMENT_LIMIT);
  const [isPricingInfoVisible, setPricingInfoVisible] = useState(false);

  const handleStart = () => {
    startAnalysis(videoId, commentLimit);
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold mb-4">Analyze Comments</h2>
      <p className="text-gray-400 mb-6">
        Get an AI-powered breakdown of the comments on this video.
      </p>

      <div className="max-w-sm mx-auto space-y-4">
        <div>
          <label htmlFor="comment-limit" className="block text-sm font-medium text-gray-400 mb-1">
            Max comments to analyze
          </label>
          <select
            id="comment-limit"
            value={commentLimit}
            onChange={(e) => setCommentLimit(Number(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
          >
            {COMMENT_LIMIT_OPTIONS.map(option => (
              <option key={option} value={option}>{option.toLocaleString()}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md text-lg"
        >
          Start Analysis
        </button>
        <button
            onClick={() => setPricingInfoVisible(true)}
            className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-300 mx-auto"
        >
            <InfoIcon className="h-4 w-4" />
            API Usage & Pricing Info
        </button>
      </div>

      {isPricingInfoVisible && <PricingInfoModal onClose={() => setPricingInfoVisible(false)} />}
    </div>
  );
};

export default IdlePanel;
