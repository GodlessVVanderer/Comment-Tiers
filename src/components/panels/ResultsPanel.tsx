import React from 'react';
import { useAppStore } from '../../store';
import StatsCard from '../StatsCard';
import CategoryAccordion from '../CategoryAccordion';
import ExportControls from '../ExportControls';

const ResultsPanel: React.FC = () => {
  const { analysisResult } = useAppStore();

  if (!analysisResult) {
    return null;
  }

  const { totalComments, analyzedComments, categories } = analysisResult;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatsCard label="Total Comments" value={totalComments.toLocaleString()} />
        <StatsCard label="Analyzed Comments" value={analyzedComments.toLocaleString()} />
        <StatsCard label="Coverage" value={`${totalComments > 0 ? Math.round((analyzedComments / totalComments) * 100) : 0}%`} />
      </div>
      <div className="space-y-2">
        {categories.map(category => (
          <CategoryAccordion key={category.name} category={category} />
        ))}
      </div>
      <ExportControls />
    </div>
  );
};

export default ResultsPanel;
