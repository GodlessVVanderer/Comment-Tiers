import React, { useEffect } from 'react';
import { useAppStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import { analyzeComments } from './services/geminiService';
import { fetchComments } from './services/youtubeService';

const App = () => {
  const {
    status,
    results,
    error,
    apiKey,
    geminiApiKey,
    setStatus,
    setResults,
    setError,
    setApiKey,
    setGeminiApiKey,
  } = useAppStore();

  useEffect(() => {
    // Load API keys from storage when the component mounts
    chrome.storage.sync.get(['youtubeApiKey', 'geminiApiKey'], (result) => {
      if (result.youtubeApiKey) {
        setApiKey(result.youtubeApiKey);
      }
      if (result.geminiApiKey) {
        setGeminiApiKey(result.geminiApiKey);
      }
    });
  }, [setApiKey, setGeminiApiKey]);

  const handleAnalyzeClick = async () => {
    if (!apiKey || !geminiApiKey) {
      setStatus('config_error');
      return;
    }
    setStatus('loading');
    try {
      const videoId = new URLSearchParams(window.location.search).get('v');
      if (!videoId) {
        throw new Error("Could not find video ID from URL. Make sure you are on a YouTube video page.");
      }
      
      const comments = await fetchComments(videoId, apiKey, 100); // Fetch 100 comments
      if (comments.length === 0) {
        setResults({ summary: "No comments found for this video or there was an issue fetching them.", categories: [], sentiment: { positive: 0, negative: 0, neutral: 0 } });
        setStatus('results');
        return;
      }
      const analysisResults = await analyzeComments(comments, geminiApiKey);
      setResults(analysisResults);
      setStatus('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResults(null);
    setError(null);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg my-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">YouTube Comment Analyzer</h2>
        <button
          onClick={() => chrome.runtime.sendMessage({ action: 'openOptionsPage' })}
          className="text-sm text-blue-400 hover:underline"
        >
          Settings
        </button>
      </div>
      
      {status === 'idle' && <IdlePanel onAnalyze={handleAnalyzeClick} />}
      {status === 'loading' && <LoadingPanel />}
      {status === 'error' && <ErrorPanel error={error} onRetry={handleAnalyzeClick} onReset={handleReset} />}
      {status === 'config_error' && <ConfigErrorPanel />}
      {status === 'results' && results && <ResultsPanel results={results} onReset={handleReset} />}
    </div>
  );
};

export default App;
