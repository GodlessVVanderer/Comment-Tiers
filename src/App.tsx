import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { COMMENT_LIMIT_OPTIONS } from './constants';
import { CategoryAccordion } from './components/CategoryAccordion';
import { StatsCard } from './components/StatsCard';
import { ExportControls } from './components/ExportControls';
import { DonationCTA } from './components/DonationCTA';
import { PricingInfoModal } from './components/PricingInfoModal';
import { SparklesIcon, QuestionMarkCircleIcon } from './components/Icons';
import { formatEta } from './utils';

interface AppProps {
  videoId: string;
}

const App: React.FC<AppProps> = ({ videoId }) => {
  const { 
    status, error, configError, categories, stats, progress, currentTask, 
    initialize, analyze, addReply, editComment, openOptionsPage 
  } = useAppStore();
  
  const [commentLimit, setCommentLimit] = useState(COMMENT_LIMIT_OPTIONS[0]);
  const [isPricingInfoOpen, setIsPricingInfoOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const isLoading = status === 'fetching' || status === 'filtering' || status === 'analyzing';

  const renderContent = () => {
    if (status === 'configuring') {
        return (
            <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 p-4 rounded-lg text-center">
              <p className="font-semibold">Configuration Required</p>
              <p className="text-sm mt-1">{configError || 'Please set your API keys.'}</p>
              <button
                  onClick={openOptionsPage}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 transition-colors"
              >
                  Open Options
              </button>
            </div>
        );
    }
    
    if (isLoading) {
      return (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-white font-semibold">{currentTask}</p>
          {progress && (
             <div className="mt-4 max-w-sm mx-auto">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.processed / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {`Processing batch ${progress.currentBatch} of ${progress.totalBatches} (${progress.processed.toLocaleString()}/${progress.total.toLocaleString()})`}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatEta(progress.etaSeconds)}</p>
            </div>
          )}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg text-center">
          <p className="font-semibold">An Error Occurred</p>
          <p className="text-sm mt-1">{error}</p>
          {(error?.includes('API key') || error?.includes('keys')) && (
            <button
                onClick={openOptionsPage}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 transition-colors"
            >
                Open Options
            </button>
          )}
        </div>
      );
    }
    
    if (status === 'success' && categories.length > 0 && stats) {
        return (
            <div className="space-y-6">
                <StatsCard stats={stats} />
                <ExportControls categories={categories} stats={stats} videoId={videoId} />
                <CategoryAccordion categories={categories} onAddReply={addReply} onEditComment={editComment} />
                <DonationCTA />
            </div>
        );
    }
    
    return (
        <div className="text-center p-6 bg-gray-800/60 border border-dashed border-gray-700 rounded-lg">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-lg font-semibold text-white">Ready to analyze?</h3>
            <p className="mt-1 text-sm text-gray-400">
                Select the number of comments and click "Analyze" to begin.
            </p>
        </div>
    );
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-300 font-sans max-w-3xl mx-auto my-4 rounded-xl border border-gray-700/80 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white mb-3 sm:mb-0">Comment Tiers Analyzer</h1>
        <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">Powered by</p>
            <span className="font-semibold text-sm text-indigo-400">Gemini</span>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow w-full">
            <label htmlFor="comment-limit" className="block text-sm font-medium text-gray-300 mb-1">
              Comments to fetch
            </label>
            <select
              id="comment-limit"
              value={commentLimit}
              onChange={(e) => setCommentLimit(Number(e.target.value))}
              disabled={isLoading || status === 'configuring'}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            >
              {COMMENT_LIMIT_OPTIONS.map(limit => (
                <option key={limit} value={limit}>{limit.toLocaleString()}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => analyze(videoId, commentLimit)}
            disabled={isLoading || status === 'configuring'}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
         <div className="text-right mt-2">
            <button 
                onClick={() => setIsPricingInfoOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
            >
                <QuestionMarkCircleIcon className="w-4 h-4" />
                How much will this cost?
            </button>
        </div>
      </div>

      {renderContent()}

      <PricingInfoModal isOpen={isPricingInfoOpen} onClose={() => setIsPricingInfoOpen(false)} />
    </div>
  );
};

export default App;