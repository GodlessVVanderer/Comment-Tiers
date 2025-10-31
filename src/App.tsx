import React, { useEffect } from 'react';
import { useAppStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import ApiKeyHelpModal from './components/ApiKeyHelpModal';
import GeminiApiKeyHelpModal from './components/GeminiApiKeyHelpModal';
import PricingInfoModal from './components/PricingInfoModal';

interface AppProps {
  videoId: string;
}

const App: React.FC<AppProps> = ({ videoId }) => {
  const {
    status,
    error,
    results,
    isHelpModalOpen,
    isGeminiHelpModalOpen,
    isPricingModalOpen,
    actions,
  } = useAppStore();

  useEffect(() => {
    actions.setVideoId(videoId);
    return () => {
      actions.reset();
    };
  }, [videoId, actions]);

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <IdlePanel onAnalyze={actions.analyze} />;
      case 'loading':
        return <LoadingPanel />;
      case 'error':
        return <ErrorPanel error={error} onRetry={actions.analyze} onReset={actions.reset} />;
      case 'configuring':
        return <ConfigErrorPanel />;
      case 'success':
        return results ? <ResultsPanel results={results} onReset={actions.reset} /> : <ErrorPanel error="Analysis finished, but no results were found." onRetry={actions.analyze} onReset={actions.reset} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-gray-200 p-4 rounded-lg border border-gray-700 w-full max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Comment Tiers Analyzer</h2>
      </div>
      {renderContent()}
      {isHelpModalOpen && <ApiKeyHelpModal onClose={actions.toggleHelpModal} />}
      {isGeminiHelpModalOpen && <GeminiApiKeyHelpModal onClose={actions.toggleGeminiHelpModal} />}
      {isPricingModalOpen && <PricingInfoModal onClose={actions.togglePricingModal} />}
    </div>
  );
};

export default App;
