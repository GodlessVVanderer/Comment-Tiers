
import React, { useEffect } from 'react';
import { useAppStore } from './store';
import type { Category } from './types';
import { CategoryAccordion } from './components/CategoryAccordion';
import { StatsCard } from './components/StatsCard';
import { ApiKeyHelpModal } from './components/ApiKeyHelpModal';
import { GeminiApiKeyHelpModal } from './components/GeminiApiKeyHelpModal';
import { PricingInfoModal } from './components/PricingInfoModal';
import { NotificationPermissionBanner } from './components/NotificationPermissionBanner';
import { LogoIcon, SparklesIcon, ErrorIcon, SearchIcon, YoutubeIcon, KeyIcon, InformationCircleIcon, CurrencyDollarIcon, HeartIcon, CoffeeIcon } from './components/Icons';
import { extractVideoId, formatEta } from './utils';

const COMMENT_LIMIT_OPTIONS = [1000, 2000, 5000, 10000, 20000, 30000];

const App: React.FC = () => {
  const {
    youtubeUrl, setYoutubeUrl,
    youtubeApiKey, setYoutubeApiKey,
    geminiApiKey, setGeminiApiKey,
    maxComments, setMaxComments,
    analysisPhase,
    error,
    categories,
    progress,
    analysisStats,
    isHelpModalOpen, setIsHelpModalOpen,
    isGeminiHelpModalOpen, setIsGeminiHelpModalOpen,
    isPricingModalOpen, setIsPricingModalOpen,
    notificationPermission,
    checkNotificationPermission,
    requestNotificationPermission,
    addReply,
    analyze,
  } = useAppStore();

  useEffect(() => {
    checkNotificationPermission();
  }, [checkNotificationPermission]);
  
  const isLoading = analysisPhase !== 'idle';
  const isValidUrl = extractVideoId(youtubeUrl) !== null;
  const canAnalyze = isValidUrl && youtubeApiKey.trim() !== '' && geminiApiKey.trim() !== '';
  
  return (
    <>
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <LogoIcon className="w-10 h-10 text-indigo-400" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Comment Tiers
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Intelligently categorize YouTube comments to uncover meaningful conversations and filter out the noise.
          </p>
        </header>

        <main>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700/50 mb-8 sticky top-4 z-10">
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <YoutubeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste a YouTube video URL..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="relative w-full">
                  <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    value={youtubeApiKey}
                    onChange={(e) => setYoutubeApiKey(e.target.value)}
                    placeholder="Enter YouTube API Key..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                  <button onClick={() => setIsHelpModalOpen(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400" aria-label="Get YouTube API Key Help">
                    <InformationCircleIcon className="w-5 h-5" />
                  </button>
                </div>
                 <div className="relative w-full">
                  <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter Gemini API Key..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                  <button onClick={() => setIsGeminiHelpModalOpen(true)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400" aria-label="Get Gemini API Key Help">
                    <InformationCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
               <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-2/3">
                    <button
                        onClick={analyze}
                        disabled={isLoading || !canAnalyze}
                        className="w-full h-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                    >
                        {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                        ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            Analyze Comments
                        </>
                        )}
                    </button>
                </div>
                <div className="w-full sm:w-1/3">
                    <label htmlFor="comment-limit" className="sr-only">Comment Limit</label>
                    <select
                        id="comment-limit"
                        value={maxComments}
                        onChange={(e) => setMaxComments(Number(e.target.value))}
                        disabled={isLoading}
                        className="w-full h-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    >
                        {COMMENT_LIMIT_OPTIONS.map(limit => (
                            <option key={limit} value={limit}>
                                Up to {limit.toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>
              </div>
               <div className="text-center -mt-2">
                  <button 
                    onClick={() => setIsPricingModalOpen(true)} 
                    className="text-xs text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
                    aria-label="Learn about API costs"
                  >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    How are API costs calculated?
                  </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {notificationPermission === 'default' && (
              <NotificationPermissionBanner onRequestPermission={requestNotificationPermission} />
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <ErrorIcon className="w-6 h-6 flex-shrink-0" />
                  <span>{error.message}</span>
                </div>
                {error.code === 'YOUTUBE_INVALID_KEY' && (
                  <button 
                    onClick={() => setIsHelpModalOpen(true)}
                    className="flex-shrink-0 text-sm bg-red-800/70 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                  >
                    Get Help
                  </button>
                )}
                {error.code === 'GEMINI_INVALID_KEY' && (
                  <button 
                    onClick={() => setIsGeminiHelpModalOpen(true)}
                    className="flex-shrink-0 text-sm bg-red-800/70 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                  >
                    Get Help
                  </button>
                )}
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


            {!isLoading && categories.length === 0 && !error && (
              <div className="text-center py-16 px-6 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-4 text-lg font-semibold text-white">Ready to Dive In?</h3>
                <p className="mt-1 text-gray-400">
                  Paste a YouTube video URL and your API Keys above to see its comments categorized into topics.
                </p>
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
          </div>
        </main>
      </div>
       <footer className="w-full max-w-4xl mx-auto text-center mt-12 text-gray-500 text-sm">
            <div className="flex justify-center items-center gap-6 mb-4">
                 <a href="https://github.com/sponsors/google" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition-colors">
                    <HeartIcon className="w-4 h-4" />
                    Sponsor
                </a>
                <span className="text-gray-600">|</span>
                <a href="https://www.buymeacoffee.com/placeholder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-yellow-400 transition-colors">
                    <CoffeeIcon className="w-4 h-4" />
                    Buy Me a Coffee
                </a>
            </div>
            <p>&copy; {new Date().getFullYear()} Comment Tiers. Created by{' '}
                <a 
                    href="https://github.com/google/aistudio-web" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-indigo-400 underline"
                >
                    AI Studio
                </a>
            </p>
      </footer>
    </div>
    <ApiKeyHelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    <GeminiApiKeyHelpModal isOpen={isGeminiHelpModalOpen} onClose={() => setIsGeminiHelpModalOpen(false)} />
    <PricingInfoModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </>
  );
};

export default App;
