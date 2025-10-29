import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { CategoryAccordion } from './components/CategoryAccordion';
import { StatsCard } from './components/StatsCard';
import { PricingInfoModal } from './components/PricingInfoModal';
import { ErrorIcon, SearchIcon, SparklesIcon, CurrencyDollarIcon } from './components/Icons';
import { formatEta } from './utils';

const COMMENT_LIMIT_OPTIONS = [1000, 2000, 5000, 10000, 20000, 30000];

interface AppProps {
  videoId: string;
}

const App: React.FC<AppProps> = ({ videoId }) => {
  const {
    maxComments, setMaxComments,
    analysisPhase,
    error,
    categories,
    progress,
    analysisStats,
    isPricingModalOpen, setIsPricingModalOpen,
    notificationPermission,
    checkNotificationPermission,
    addReply,
    analyze,
    reset,
  } = useAppStore();

  useEffect(() => {
    checkNotificationPermission();
    // Start analysis immediately when the component is rendered
    analyze(videoId);

    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [videoId, analyze, checkNotificationPermission, reset]);
  
  const isLoading = analysisPhase !== 'idle';
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-2xl border border-gray-700/50 mb-8 w-full">
      <header className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Comment Analysis</h2>
      </header>
      
      <main>
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
            <ErrorIcon className="w-6 h-6 flex-shrink-0" />
            <span>{error.message}</span>
          </div>
        )}
        
        {isLoading && (
          <div className="mb-6 px-2">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-indigo-300">
                {analysisPhase === 'fetching' && `Fetching up to ${maxComments.toLocaleString()} comments...`}
                {analysisPhase === 'analyzing' && (
                    progress 
                    ? `Analyzing Batch ${progress.currentBatch} of ${progress.totalBatches}...`
                    : 'Preparing for analysis...'
                )}
              </span>
              <span className="text-sm font-medium text-indigo-300">{progress ? `${Math.round((progress.processed / progress.total) * 100)}%` : ''}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 relative overflow-hidden">
              {analysisPhase === 'fetching' ? (
                <div className="absolute top-0 h-full w-1/4 bg-indigo-500 rounded-full animate-indeterminate"></div>
              ) : (
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: progress ? `${(progress.processed / progress.total) * 100}%` : '0%' }}>
                </div>
              )}
            </div>
             {progress && progress.etaSeconds !== null && (
                <p className="text-xs text-center text-gray-400">
                  {formatEta(progress.etaSeconds)}
                </p>
            )}
          </div>
        )}
        
        {analysisStats && !isLoading && (
           <div className="mb-6 space-y-6">
            <StatsCard stats={analysisStats} />
           </div>
        )}

        {categories.length > 0 && (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <CategoryAccordion 
                key={category.id} 
                category={category} 
                isInitiallyOpen={index === 0}
                onAddReply={addReply}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center mt-6">
         <button 
            onClick={() => setIsPricingModalOpen(true)} 
            className="text-xs text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
            aria-label="Learn about API costs"
          >
            <CurrencyDollarIcon className="w-4 h-4" />
            How are API costs calculated?
          </button>
      </footer>
       <PricingInfoModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </div>
  );
};

export default App;
