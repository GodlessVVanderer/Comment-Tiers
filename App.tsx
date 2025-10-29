import React, { useState, useEffect, useReducer, useCallback } from 'react';
import type { Category, AnalysisStats, ProgressUpdate, Comment } from './types';
import { fetchComments } from './services/youtubeService';
import { categorizeComments } from './services/geminiService';
import { COMMENT_LIMIT_OPTIONS } from './constants';
import { formatEta } from './utils';
import { StatsCard } from './components/StatsCard';
import { CategoryAccordion } from './components/CategoryAccordion';
import { ExportControls } from './components/ExportControls';
import { DonationCTA } from './components/DonationCTA';
import { ApiKeyHelpModal } from './components/ApiKeyHelpModal';
import { GeminiApiKeyHelpModal } from './components/GeminiApiKeyHelpModal';
import { PricingInfoModal } from './components/PricingInfoModal';
import { NotificationPermissionBanner } from './components/NotificationPermissionBanner';
import { SparklesIcon, KeyIcon, QuestionMarkCircleIcon } from './components/Icons';

declare const chrome: any;

type AppState = 'idle' | 'fetching' | 'analyzing' | 'complete' | 'error';

interface State {
  categories: Category[];
}

type Action = { type: 'ADD_CATEGORIES'; payload: Category[] } | { type: 'ADD_REPLY'; payload: { categoryTitle: string, path: number[], newReplyText: string } } | { type: 'RESET' };

const categoryReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_CATEGORIES':
      // Merge new categories with existing ones
      const newCategoriesMap = new Map(state.categories.map(c => [c.categoryTitle, c]));
      action.payload.forEach(newCat => {
        if (newCategoriesMap.has(newCat.categoryTitle)) {
          const existingCat = newCategoriesMap.get(newCat.categoryTitle)!;
          existingCat.comments.push(...newCat.comments);
        } else {
          newCategoriesMap.set(newCat.categoryTitle, newCat);
        }
      });
      return { ...state, categories: Array.from(newCategoriesMap.values()) };
    case 'ADD_REPLY':
      const { categoryTitle, path, newReplyText } = action.payload;
      const updatedCategories = state.categories.map(cat => {
        if (cat.categoryTitle === categoryTitle) {
          // This is a simplified deep copy for the reply path.
          const newCat = JSON.parse(JSON.stringify(cat));
          let commentToUpdate: Comment | undefined = newCat.comments[path[0]];
          for (let i = 1; i < path.length; i++) {
            if (commentToUpdate && commentToUpdate.replies) {
              commentToUpdate = commentToUpdate.replies[i];
            }
          }
          if (commentToUpdate) {
            if (!commentToUpdate.replies) {
              commentToUpdate.replies = [];
            }
            commentToUpdate.replies.push({
              id: `reply-${Date.now()}`,
              author: "You (Local Reply)",
              text: newReplyText
            });
          }
          return newCat;
        }
        return cat;
      });
      return { ...state, categories: updatedCategories };
    case 'RESET':
      return { categories: [] };
    default:
      return state;
  }
};

const App: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);

  const [youtubeKey, setYoutubeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [keysLoaded, setKeysLoaded] = useState(false);
  
  const [maxComments, setMaxComments] = useState(COMMENT_LIMIT_OPTIONS[0]);
  const [targetLanguage, setTargetLanguage] = useState('en-US'); // Default to English
  
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [{ categories }, dispatch] = useReducer(categoryReducer, { categories: [] });

  const [isYoutubeHelpOpen, setYoutubeHelpOpen] = useState(false);
  const [isGeminiHelpOpen, setGeminiHelpOpen] = useState(false);
  const [isPricingInfoOpen, setPricingInfoOpen] = useState(false);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['youtubeApiKey', 'geminiApiKey'], (result: any) => {
        setYoutubeKey(result.youtubeApiKey || '');
        setGeminiKey(result.geminiApiKey || '');
        setKeysLoaded(true);
      });
    } else {
      console.warn("chrome.storage.local not available. Using local state for API keys.");
      setKeysLoaded(true); // In dev environment without chrome APIs
    }
  }, []);

  const handleUpdate = useCallback((newCategories: Category[], newProgress: ProgressUpdate) => {
    dispatch({ type: 'ADD_CATEGORIES', payload: newCategories });
    setProgress(newProgress);
  }, []);

  const handleAnalysis = async () => {
    setAppState('fetching');
    setError(null);
    setProgress(null);
    setStats(null);
    dispatch({ type: 'RESET' });

    try {
      const comments = await fetchComments(videoId, youtubeKey, maxComments);
      setAppState('analyzing');
      const analysisStats = await categorizeComments(comments, targetLanguage, handleUpdate, geminiKey);
      setStats(analysisStats);
      setAppState('complete');
      
      if (typeof chrome !== 'undefined' && chrome.runtime && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Comment Analysis Complete!', {
              body: `Finished analyzing comments for video ID: ${videoId}`,
              icon: chrome.runtime.getURL('icon128.png'),
          });
      }

    } catch (e) {
      const err = e as Error;
      let userFriendlyMessage = err.message;

      // Custom error messages from youtubeService
      const ytErrorMap: Record<string, string> = {
          'YOUTUBE_QUOTA_EXCEEDED': 'YouTube API quota exceeded. Please try again later or use a different key.',
          'YOUTUBE_VIDEO_NOT_FOUND': 'This YouTube video could not be found.',
          'YOUTUBE_COMMENTS_DISABLED': 'Comments are disabled for this video.',
          'YOUTUBE_INVALID_KEY': 'The provided YouTube API key is invalid.',
          'YOUTUBE_FORBIDDEN': 'Permission denied. Check your YouTube API key restrictions.',
      };
      if (ytErrorMap[err.message]) {
        userFriendlyMessage = ytErrorMap[err.message];
      }

      setError(userFriendlyMessage);
      setAppState('error');
    }
  };

  const handleAddReply = (categoryTitle: string, path: number[], newReplyText: string) => {
    dispatch({ type: 'ADD_REPLY', payload: { categoryTitle, path, newReplyText } });
  };
  
  const renderProgress = () => {
    if (!progress || appState !== 'analyzing') return null;
    const percentage = progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;
    const eta = formatEta(progress.etaSeconds);

    return (
      <div className="my-4">
        <p className="text-sm text-center text-gray-300 mb-2">
          Analyzing batch {progress.currentBatch} of {progress.totalBatches}... ({progress.processed.toLocaleString()} / {progress.total.toLocaleString()} comments)
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        {eta && <p className="text-xs text-center text-gray-400 mt-2">{eta}</p>}
      </div>
    );
  };
  
  if (!keysLoaded) {
    return <div className="text-center p-8 text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-200 p-4 my-6 rounded-lg shadow-xl border border-gray-700/50 max-w-4xl mx-auto font-sans">
        <h2 className="text-2xl font-bold text-white text-center mb-1">YouTube Comment Analyzer</h2>
        <p className="text-center text-gray-400 text-sm mb-4">Group and summarize thousands of comments with AI</p>

        {appState === 'idle' || appState === 'error' ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <NotificationPermissionBanner />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* API Keys */}
                <div className="relative">
                  <label htmlFor="youtube-key" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                    YouTube API Key 
                    <button onClick={() => setYoutubeHelpOpen(true)} className="text-gray-500 hover:text-indigo-400"><QuestionMarkCircleIcon className="w-4 h-4" /></button>
                  </label>
                  <KeyIcon className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="youtube-key" type="password" value={youtubeKey} onChange={e => setYoutubeKey(e.target.value)} placeholder="Required" className="w-full pl-10 pr-4 py-2 mt-1 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div className="relative">
                   <label htmlFor="gemini-key" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                     Gemini API Key 
                     <button onClick={() => setGeminiHelpOpen(true)} className="text-gray-500 hover:text-indigo-400"><QuestionMarkCircleIcon className="w-4 h-4" /></button>
                  </label>
                  <SparklesIcon className="absolute left-3 top-[38px] w-5 h-5 text-gray-400 pointer-events-none" />
                  <input id="gemini-key" type="password" value={geminiKey} onChange={e => setGeminiKey(e.target.value)} placeholder="Required" className="w-full pl-10 pr-4 py-2 mt-1 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>

                {/* Options */}
                 <div>
                    <label htmlFor="max-comments" className="text-sm font-medium text-gray-300">Max Comments to Fetch</label>
                    <select id="max-comments" value={maxComments} onChange={e => setMaxComments(Number(e.target.value))} className="w-full py-2 px-3 mt-1 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                      {COMMENT_LIMIT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toLocaleString()}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="language" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                      Analysis Language
                      <button onClick={() => setPricingInfoOpen(true)} className="text-gray-500 hover:text-indigo-400"><QuestionMarkCircleIcon className="w-4 h-4" /></button>
                    </label>
                    <input id="language" type="text" value={targetLanguage} onChange={e => setTargetLanguage(e.target.value)} placeholder="e.g., es-MX, ja-JP" className="w-full py-2 px-3 mt-1 bg-gray-900/70 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
              </div>

              {error && <div className="mt-4 text-center bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-sm">{error}</div>}

              <button 
                onClick={handleAnalysis} 
                disabled={!youtubeKey || !geminiKey}
                className="w-full mt-6 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-lg"
              >
                Analyze Comments
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                API keys are required. Click the '?' icons for help. Keys are stored in your browser's local storage for this extension.
              </p>
          </div>
        ) : (
          <div>
            <div className="text-center font-semibold text-xl my-4">
              {appState === 'fetching' && 'Fetching comments...'}
              {appState === 'analyzing' && 'Analyzing comments...'}
              {appState === 'complete' && 'Analysis Complete'}
            </div>
            {renderProgress()}
          </div>
        )}

        {stats && <StatsCard stats={stats} />}
        
        <ExportControls categories={categories} stats={stats} videoId={videoId} />

        <div className="space-y-4 mt-6">
          {categories.sort((a, b) => b.comments.length - a.comments.length).map((cat, index) => (
            <CategoryAccordion 
              key={`${cat.categoryTitle}-${index}`} 
              category={cat} 
              isInitiallyOpen={index < 2} 
              onAddReply={handleAddReply}
            />
          ))}
        </div>

        {appState === 'complete' && <DonationCTA />}

        {/* Modals */}
        <ApiKeyHelpModal isOpen={isYoutubeHelpOpen} onClose={() => setYoutubeHelpOpen(false)} />
        <GeminiApiKeyHelpModal isOpen={isGeminiHelpOpen} onClose={() => setGeminiHelpOpen(false)} />
        <PricingInfoModal isOpen={isPricingInfoOpen} onClose={() => setPricingInfoOpen(false)} />
    </div>
  );
};

export default App;
