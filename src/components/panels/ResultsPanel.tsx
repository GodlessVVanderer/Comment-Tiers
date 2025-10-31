// FIX: Removed unnecessary chrome types reference as this component does not use the chrome API directly.
import React, { useState } from 'react';
// FIX: Use relative paths for imports
import { useAppStore } from '../../store';
import { AnalysisResults, Category } from '../../types';
import CategoryAccordion from '../CategoryAccordion';
import StatsCard from '../StatsCard';
import ExportControls from '../ExportControls';
import LiveConversation from '../LiveConversation';
import DonationCTA from '../DonationCTA';
import { formatNumber } from '../../utils';
import { ClockIcon } from '../Icons';

const ResultsPanel: React.FC = () => {
  const { results, actions } = useAppStore();
  const [activeTab, setActiveTab] = useState('comments');

  if (!results) return null;

  const { stats, categories } = results;

  const renderTabContent = () => {
    switch(activeTab) {
      case 'comments':
        return (
          <div className="space-y-2 mt-4">
            {categories.map((category) => (
              <CategoryAccordion key={category.category} categoryData={category} />
            ))}
          </div>
        );
      case 'liveChat':
        return <LiveConversation />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Analysis Complete</h3>
          <div className="flex items-center text-sm text-gray-400 mt-1 gap-4">
              <span className="flex items-center"><ClockIcon className="mr-1.5"/>{`${stats.analyzedComments} comments analyzed`}</span>
          </div>
        </div>
        <button
          onClick={actions.reset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md flex-shrink-0 ml-4"
        >
          Analyze Again
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Comments Fetched" value={formatNumber(stats.totalComments)} />
        <StatsCard title="Spam / Low-Effort Filtered" value={formatNumber(stats.filteredComments)} />
        <StatsCard title="Comments Analyzed" value={formatNumber(stats.analyzedComments)} />
      </div>

      <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                  onClick={() => setActiveTab('comments')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'comments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
              >
                  Comment Categories
              </button>
              <button
                  onClick={() => setActiveTab('liveChat')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'liveChat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
              >
                  Live Conversation
              </button>
          </nav>
      </div>
      
      <div className="mt-4">
        {renderTabContent()}
      </div>
      
      {activeTab === 'comments' && <ExportControls categories={categories} />}

      <DonationCTA />
    </div>
  );
};

export default ResultsPanel;
