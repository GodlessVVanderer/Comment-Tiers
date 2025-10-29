
import React, { useEffect, useCallback } from 'react';
import { useAppStore } from './store';
import type { Comment } from './types';
import { StatsCard } from './components/StatsCard';
import { CategoryAccordion } from './components/CategoryAccordion';
import { ExportControls } from './components/ExportControls';
import { DonationCTA } from './components/DonationCTA';
import { COMMENT_LIMIT_OPTIONS } from './constants';
import { formatEta } from './utils';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

interface AppProps {
  videoId: string;
}

const App: React.FC<AppProps> = ({ videoId }) => {
  const { 
    status, 
    error, 
    stats, 
    progress, 
    categories,
    keysLoaded,
    commentLimit,
    initialize,
    analyze,
    setCommentLimit,
    addCommentToCategory,
    addReplyToComment,
    editCommentInCategory,
    reset
  } = useAppStore();

  useEffect(() => {
    reset();
    initialize();
  }, [videoId, initialize, reset]);

  const handleAnalyze = () => {
    analyze(videoId);
  };
  
  const handleAddReply = useCallback((categoryTitle: string, path: number[], newReplyText: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: 'You (Local)',
      text: newReplyText,
      timestamp: Date.now(),
      isEditable: true,
    };
    addReplyToComment(categoryTitle, path, newReply);
  }, [addReplyToComment]);

  const handleAddComment = useCallback((categoryTitle: string, newCommentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'You (Local)',
      text: newCommentText,
      timestamp: Date.now(),
      isEditable: true,
      replies: [],
    };
    addCommentToCategory(categoryTitle, newComment);
  }, [addCommentToCategory]);

  const handleEditComment = useCallback((categoryTitle: string, path: number[], newText: string) => {
    editCommentInCategory(categoryTitle, path, newText);
  }, [editCommentInCategory]);


  const renderContent = () => {
    switch(status) {
        case 'fetching':
            return <div className="text-center p-8">Fetching comments... ({stats.total.toLocaleString()} loaded so far)</div>;
        case 'preprocessing':
            return <div className="text-center p-8">Prefiltering and cleaning comments...</div>;
        case 'analyzing':
            const percent = progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;
            const eta = formatEta(progress.etaSeconds);
            return (
                <div className="text-center p-8 space-y-4">
                    <h3 className="text-xl font-semibold">Analyzing Comments...</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                    <p>Processed {progress.processed.toLocaleString()} of {progress.total.toLocaleString()} comments.</p>
                    <p className="text-sm text-gray-400">Batch {progress.currentBatch} of {progress.totalBatches}. {eta && `(${eta})`}</p>
                </div>
            );
        case 'complete':
            return (
                <div className="space-y-6">
                    <StatsCard stats={stats} />
                    <ExportControls categories={categories} stats={stats} videoId={videoId} />
                    {categories.map((category, index) => (
                        <CategoryAccordion 
                            key={category.categoryTitle} 
                            category={category} 
                            isInitiallyOpen={index < 2}
                            onAddReply={handleAddReply}
                            onAddComment={handleAddComment}
                            onEditComment={handleEditComment}
                        />
                    ))}
                    <DonationCTA />
                </div>
            );
        case 'error':
            return <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">{error}</div>;
        case 'idle':
        case 'configuring':
        default:
            if (!keysLoaded) {
              return <div className="text-center p-8">Loading settings...</div>;
            }
            if (status === 'configuring') {
              return (
                <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-300 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Configuration Required</h3>
                  <p className="text-sm mb-4">
                    Please set your YouTube and Gemini API keys in the extension's options page.
                  </p>
                  <a 
                    href={chrome.runtime.getURL('options.html')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    Open Settings
                  </a>
                </div>
              );
            }
            return (
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 shadow-lg space-y-6">
                    <h2 className="text-2xl font-bold text-white text-center">YouTube Comment Analyzer</h2>
                    
                    <div>
                        <label htmlFor="comment-limit" className="text-sm font-medium text-gray-300">Max comments to fetch</label>
                        <select id="comment-limit" value={commentLimit} onChange={(e) => setCommentLimit(Number(e.target.value))} className="w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded-lg focus:ring-indigo-500">
                            {COMMENT_LIMIT_OPTIONS.map(limit => <option key={limit} value={limit}>{limit.toLocaleString()}</option>)}
                        </select>
                    </div>

                    <button onClick={handleAnalyze} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Analyze Comments
                    </button>
                    {error && <div className="text-red-400 text-center text-sm">{error}</div>}
                </div>
            );
    }
  };

  return (
    <div className="text-gray-200 font-sans p-4 bg-[#0d1117] rounded-lg my-6 mx-auto max-w-4xl">
      {renderContent()}
    </div>
  );
};

export default App;