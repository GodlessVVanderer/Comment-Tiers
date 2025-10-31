// FIX: Create main App component to render panels based on state.
import React, { useEffect } from 'react';
import { useAppStore } from './store';
import IdlePanel from './components/panels/IdlePanel';
import LoadingPanel from './components/panels/LoadingPanel';
import ResultsPanel from './components/panels/ResultsPanel';
import ErrorPanel from './components/panels/ErrorPanel';
import ConfigErrorPanel from './components/panels/ConfigErrorPanel';
import PricingInfoModal from './components/PricingInfoModal';

const App: React.FC = () => {
  const { status, actions, isPricingModalOpen } = useAppStore();

  useEffect(() => {
    // Check for API keys when the app loads
    actions.validateKeys();
  }, [actions]);

  const renderPanel = () => {
    switch (status) {
      case 'idle':
        return <IdlePanel />;
      case 'loading':
        return <LoadingPanel />;
      case 'results':
        return <ResultsPanel />;
      case 'error':
        return <ErrorPanel />;
      case 'config-error':
          return <ConfigErrorPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-gray-200 p-4 rounded-b-lg font-sans">
        <main>
          {renderPanel()}
        </main>
        {isPricingModalOpen && <PricingInfoModal onClose={actions.togglePricingModal} />}
    </div>
  );
};

export default App;