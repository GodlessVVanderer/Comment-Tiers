import React, { useEffect, useState } from 'react';
import { useAppStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import LiveConversation from './components/LiveConversation';
import DonationCTA from './components/DonationCTA';

const App: React.FC = () => {
  const { status, actions } = useAppStore();
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    // Simple way to get video ID from URL
    const videoIdMatch = window.location.search.match(/[?&]v=([^&]+)/);
    if (videoIdMatch) {
      setVideoId(videoIdMatch[1]);
    }
  }, []);

  const renderPanel = () => {
    if (!videoId) {
      return <ErrorPanel error="Could not detect YouTube video ID." onRetry={() => window.location.reload()} />;
    }
    switch (status) {
      case 'idle':
        return <IdlePanel videoId={videoId} />;
      case 'loading':
        return <LoadingPanel />;
      case 'error':
        return <ErrorPanel />;
      case 'config-error':
        return <ConfigErrorPanel />;
      case 'results':
        return <ResultsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto p-4 bg-gray-800 text-white rounded-lg shadow-lg font-sans">
      <header className="flex justify-between items-center pb-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">YouTube Comment Analyzer</h1>
        <button onClick={() => actions.reset()} className="text-sm text-gray-400 hover:text-white">
          Reset
        </button>
      </header>
      <main className="mt-4">
        {renderPanel()}
        <LiveConversation />
        <DonationCTA />
      </main>
    </div>
  );
};

export default App;
