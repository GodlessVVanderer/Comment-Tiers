import React, { useEffect } from 'react';
import { useStore } from './store';
import { IdlePanel } from './components/panels/IdlePanel';
import { LoadingPanel } from './components/panels/LoadingPanel';
import { ResultsPanel } from './components/panels/ResultsPanel';
import { ErrorPanel } from './components/panels/ErrorPanel';
import { ConfigErrorPanel } from './components/panels/ConfigErrorPanel';

interface AppProps {
  videoId: string;
}

const App: React.FC<AppProps> = ({ videoId }) => {
  const { status, initialize } = useStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const renderPanel = () => {
    switch (status) {
      case 'idle':
        return <IdlePanel videoId={videoId} />;
      case 'configuring':
        return <ConfigErrorPanel />;
      case 'fetching':
      case 'filtering':
      case 'analyzing':
        return <LoadingPanel />;
      case 'success':
        return <ResultsPanel />;
      case 'error':
        return <ErrorPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-300 font-sans p-4 rounded-lg my-4 border border-gray-700">
      {renderPanel()}
    </div>
  );
};

export default App;
