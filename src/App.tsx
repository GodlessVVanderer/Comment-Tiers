import React from 'react';
import { useAppStore } from './store';
import { IdlePanel } from './components/panels/IdlePanel';
import { LoadingPanel } from './components/panels/LoadingPanel';
import { ResultsPanel } from './components/panels/ResultsPanel';
import { ErrorPanel } from './components/panels/ErrorPanel';
import { ConfigErrorPanel } from './components/panels/ConfigErrorPanel';
import { PricingInfoModal } from './components/PricingInfoModal';
import { CurrencyDollarIcon } from './components/Icons';

export const App: React.FC = () => {
  const { status, error, configError, isPricingInfoModalOpen, openPricingInfoModal, closePricingInfoModal } = useAppStore();

  const renderPanel = () => {
    if (configError) {
      return <ConfigErrorPanel />;
    }
    if (error) {
      return <ErrorPanel />;
    }
    switch (status) {
      case 'idle':
        return <IdlePanel />;
      case 'fetching':
      case 'filtering':
      case 'analyzing':
        return <LoadingPanel />;
      case 'success':
        return <ResultsPanel />;
      default:
        return <IdlePanel />;
    }
  };

  return (
    <div className="w-full bg-gray-900 text-gray-300 font-sans p-4 rounded-lg border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">YouTube Comment Analyzer</h1>
        <button
            onClick={openPricingInfoModal}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
        >
            <CurrencyDollarIcon className="w-4 h-4" />
            API Cost Info
        </button>
      </div>
      {renderPanel()}
      {isPricingInfoModalOpen && <PricingInfoModal onClose={closePricingInfoModal} />}
    </div>
  );
};
