import React, { useState } from 'react';
// FIX: Use relative path for module import.
import { useAppStore } from '../../store';
import CategoryAccordion from '../CategoryAccordion';
import StatsCard from '../StatsCard';
import ExportControls from '../ExportControls';
import LiveConversation from '../LiveConversation';
import DonationCTA from '../DonationCTA';
// FIX: Use relative path for module import.
import { Category } from '../../types';

const ResultsPanel: React.FC = () => {
  const { results, actions } = useAppStore();
  const [activeTab, setActiveTab] = useState('comments');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  if (!results) return null;

  const { stats, categories } = results;

  const handleToggleCategory = (categoryName: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    setOpenCategories(new Set(categories.map((c: Category) => c.category)));
  };

  const handleCollapseAll = () => {
    setOpenCategories(new Set());
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'comments':
        return (
          <>
            <div className="flex justify-end gap-2 mb-2">
                <button 
                    onClick={handleExpandAll}
                    className="text-xs bg-gray-600 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md"
                >
                    Expand All
                </button>
                <button 
                    onClick={handleCollapseAll}
                    className="text-xs bg-gray-600 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md"
                >
                    Collapse All
                </button>
            </div>
            <div className="space-y-2">
              {categories.map((category: Category) => (
                <CategoryAccordion 
                  key={category.category} 
                  categoryData={category}
                  isOpen={openCategories.has(category.category)}
                  onToggle={() => handleToggleCategory(category.category)}
                />
              ))}
            </div>
          </>
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
        </div>
        <button
          onClick={actions.reset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md flex-shrink-0 ml-4"
        >
          Analyze Again
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Comments Fetched" value={stats.totalComments} />
        <StatsCard title="Spam / Filtered" value={stats.filteredComments} />
        <StatsCard title="Comments Analyzed" value={stats.analyzedComments} />
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