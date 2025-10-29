
import React, { useState, useEffect, useCallback } from 'react';
import type { Comment, Category, AnalysisStats, ProgressUpdate } from './types';
import { useAppStore } from './store';
import { fetchComments } from './services/youtubeService';
import { analyzeComments } from './services/geminiService';
import { StatsCard } from './components/StatsCard';
import { CategoryAccordion } from './components/CategoryAccordion';
import { COMMENT_LIMIT_OPTIONS, MIN_WORD_COUNT, NGRAM_SIZE, NGRAM_SPAM_THRESHOLD } from './constants';
import { ExportControls } from './components/ExportControls';
import { ApiKeyHelpModal } from './components/ApiKeyHelpModal';
import { GeminiApiKeyHelpModal } from './components/GeminiApiKeyHelpModal';
import { PricingInfoModal } from './components/PricingInfoModal';
import { DonationCTA } from './components/DonationCTA';
import { formatEta } from './utils';
import { KeyIcon, SparklesIcon, QuestionMarkCircleIcon } from './components/Icons';

// FIX: Declare chrome for TypeScript
declare const chrome: any;

type Status = 'idle' | 'fetching' | 'filtering' | 'analyzing' | 'complete' | 'error';

const App: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { youtubeApiKey, geminiApiKey, initialize, isInitialized } = useAppStore();
  
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  
  const [commentLimit, setCommentLimit] = useState(COMMENT_LIMIT_OPTIONS[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);

  const [isYtHelpOpen, setIsYtHelpOpen] = useState(false);
  const [isGeminiHelpOpen, setIsGeminiHelpOpen] = useState(false);
  const [isPricingInfoOpen, setIsPricingInfoOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleAnalysis = useCallback(async () => {
    if (!youtubeApiKey || !geminiApiKey) {
      setError("Please set both YouTube and Gemini API keys in the extension options.");
      setStatus('error');
      return;
    }
    
    setStatus('fetching');
    setError(null);
    setProgress(null);
    setCategories([]);
    setStats(null);

    try {
      const allComments = await fetchComments(videoId, youtubeApiKey, commentLimit);
      
      setStatus('filtering');
      
      const filteredComments: Comment[] = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            action: 'prefilter-comments',
            payload: {
              comments: allComments,
              minWordCount: MIN_WORD_COUNT,
              ngramSize: NGRAM_SIZE,
              spamThreshold: NGRAM_SPAM_THRESHOLD,
            },
          },
          (response: Comment[]) => {
            resolve(response);
          }
        );
      });
      
      setStats({
        total: allComments.length,
        filtered: allComments.length - filteredComments.length,
        analyzed: filteredComments.length,
      });

      if (filteredComments.length === 0) {
        setStatus('complete');
        setError("No comments left after filtering. Try increasing the comment limit or checking a different video.");
        return;
      }
      
      setStatus('analyzing');
      const analysisResults = await analyzeComments(
        filteredComments, 
        geminiApiKey,
        (update) => setProgress(update)
      );
      
      setCategories(analysisResults);
      setStatus('complete');

    } catch (e) {
      const err = e as Error;
      let friendlyMessage = err.message || 'An unknown error occurred.';
      if (err.message.includes('YOUTUBE_')) friendlyMessage = getYouTubeErrorMessage(err.message);
      if (err.message.includes('GEMINI_')) friendlyMessage = getGeminiErrorMessage(err.message);
      if (err.message.includes('API key not valid')) friendlyMessage = getGeminiErrorMessage('GEMINI_INVALID_KEY');


      setError(friendlyMessage);
      setStatus('error');
    }
  }, [videoId, youtubeApiKey, geminiApiKey, commentLimit]);

  const getYouTubeErrorMessage = (code: string) => {
    switch (code) {
      case 'YOUTUBE_QUOTA_EXCEEDED':
        return "YouTube API daily quota exceeded. Please try again tomorrow or use a different key.";
      case 'YOUTUBE_INVALID_KEY':
        return "The provided YouTube API key is invalid. Please check it in the extension options.";
      case 'YOUTUBE_COMMENTS_DISABLED':
        return "Comments are disabled for this video.";
      case 'YOUTUBE_VIDEO_NOT_FOUND':
        return "This video could not be found.";
      default:
        return "An error occurred with the YouTube API. Please check your key and permissions.";
    }
  };
  
  const getGeminiErrorMessage = (code: string) => {
    if (code.includes('429')) {
       return "Gemini API rate limit reached. Please wait and try again.";
    }
    switch (code) {
      case 'GEMINI_INVALID_KEY':
         return "The provided Gemini API key is invalid. Please check it in the extension options.";
      default:
        return `An error occurred with the Gemini API. Please check your API key and that billing is enabled.`;
    }
  }

  const resetState = () => {
    setStatus('idle');
    setError(null);
    setProgress(null);
    setCategories([]);
    setStats(null);
  };

  const handleAddReply = (categoryIndex: number, path: number[], newReplyText: string) => {
    setCategories(prevCategories => {
        const newCategories = JSON.parse(JSON.stringify(prevCategories));
        const category = newCategories[categoryIndex];
        if (!category) return prevCategories;

        let commentToUpdate: Comment | undefined = category.comments[path[0]];
        for (let i = 1; i < path.length; i++) {
            if (commentToUpdate && commentToUpdate.replies) {
                commentToUpdate = commentToUpdate.replies[i];
            } else {
                return prevCategories; // Path is invalid
            }
        }

        if (commentToUpdate) {
            if (!commentToUpdate.replies) {
                commentToUpdate.replies = [];
            }
            commentToUpdate.replies.unshift({
                id: `local-reply-${Date.now()}`,
                author: 'You (Local Reply)',
                text: newReplyText,
                isEditable: true,
                timestamp: Date.now()
            });
        }
        return newCategories;
    });
  };

  const handleEditComment = (categoryIndex: number, path: number[], newText: string) => {
    setCategories(prevCategories => {
        const newCategories = JSON.parse(JSON.stringify(prevCategories));
        const category = newCategories[categoryIndex];
        if (!category) return prevCategories;
        
        let commentToUpdate: Comment | undefined = category.comments[path[0]];
        for (let i = 1; i < path.length; i++) {
            if (commentToUpdate && commentToUpdate.replies) {
                commentToUpdate = commentToUpdate.replies[i];
            } else {
                return prevCategories; // Path is invalid
            }
        }

        if (commentToUpdate) {
            commentToUpdate.text = newText;
        }

        return newCategories;
    });
  };


  const renderStatus = () => {
    switch (status) {
      case 'fetching':
        return <p>Fetching comments...</p>;
      case 'filtering':
        return <p>Filtering comments for relevance and spam...</p>;
      case 'analyzing':
        if (!progress) return <p>Preparing analysis...</p>;
        const { processed, total, etaSeconds } = progress;
        const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
        return (
          <div className="w-full">
            <p className="mb-2">Analyzing batch {progress.currentBatch} of {progress.totalBatches}...</p>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{processed.toLocaleString()}/{total.toLocaleString()} comments</span>
              <span>{formatEta(etaSeconds)}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isInitialized) {
      return (
        <div className="text-center p-8">
            <p>Initializing...</p>
        </div>
      );
  }

  const isLoading = status === 'fetching' || status === 'filtering' || status === 'analyzing';

  const openOptionsPage = () => {
    chrome.runtime.sendMessage({ action: 'open-options-page' });
  };
  
  return (
    <div className="bg-gray-900 text-gray-300 font-sans p-4 sm:p-6 rounded-b-xl border-t-2 border-indigo-500/50">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">YouTube Comment Analyzer</h1>
            <p className="text-sm text-gray-400 mt-1">
              Powered by Google Gemini
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
             {!youtubeApiKey && (
                  <button onClick={openOptionsPage} className="flex items-center text-sm text-red-400 font-semibold bg-red-900/40 px-3 py-1.5 rounded-md hover:bg-red-900/60">
                      <KeyIcon className="w-4 h-4 mr-1.5" /> Set YouTube Key
                  </button>
              )}
              {!geminiApiKey && (
                  <button onClick={openOptionsPage} className="flex items-center text-sm text-indigo-400 font-semibold bg-indigo-900/40 px-3 py-1.5 rounded-md hover:bg-indigo-900/60">
                      <SparklesIcon className="w-4 h-4 mr-1.5" /> Set Gemini Key
                  </button>
              )}
          </div>
        </header>

        {status === 'idle' && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-grow flex items-center gap-3">
              <label htmlFor="comment-limit" className="text-white font-medium whitespace-nowrap">Analyze up to</label>
              <select
                id="comment-limit"
                value={commentLimit}
                onChange={(e) => setCommentLimit(Number(e.target.value))}
                className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {COMMENT_LIMIT_OPTIONS.map(limit => <option key={limit} value={limit}>{limit.toLocaleString()}</option>)}
              </select>
              <span className="text-white">comments</span>
            </div>
             <button onClick={() => setIsPricingInfoOpen(true)} className="text-xs text-gray-500 hover:text-indigo-400 flex items-center gap-1">
                <QuestionMarkCircleIcon className="w-4 h-4" /> How much does this cost?
              </button>
            <button
              onClick={handleAnalysis}
              disabled={!youtubeApiKey || !geminiApiKey}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Start Analysis
            </button>
          </div>
        )}

        {isLoading && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 text-center">
            {renderStatus()}
          </div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-4 my-4">
            <p className="font-bold text-red-200">Error</p>
            <p className="text-red-300">{error}</p>
             {(status === 'error' || (status === 'complete' && categories.length === 0)) && (
                <button onClick={resetState} className="mt-3 px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600">
                    Try Again
                </button>
            )}
          </div>
        )}
        
        {status === 'complete' && stats && (
          <div className="space-y-6 mt-6">
            <StatsCard stats={stats} />
            <ExportControls categories={categories} stats={stats} videoId={videoId} />
            {categories.length > 0 ? (
                <CategoryAccordion 
                    categories={categories}
                    onAddReply={handleAddReply}
                    onEditComment={handleEditComment}
                />
            ) : (
                !error && <p className="text-center py-4">Analysis complete, but no distinct categories were found.</p>
            )}
            <DonationCTA />
          </div>
        )}

      </div>
      <ApiKeyHelpModal isOpen={isYtHelpOpen} onClose={() => setIsYtHelpOpen(false)} />
      <GeminiApiKeyHelpModal isOpen={isGeminiHelpOpen} onClose={() => setIsGeminiHelpOpen(false)} />
      <PricingInfoModal isOpen={isPricingInfoOpen} onClose={() => setIsPricingInfoOpen(false)} />
    </div>
  );
};

export default App;
