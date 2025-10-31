import React from 'react';
import { AnalysisResults } from '../../types';
import CategoryAccordion from '../CategoryAccordion';
import StatsCard from '../StatsCard';
import ExportControls from '../ExportControls';

interface ResultsPanelProps {
  results: AnalysisResults;
  onReset: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onReset }) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Analysis Complete</h3>
          <p className="text-gray-400 mt-1">{results.summary}</p>
        </div>
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md flex-shrink-0 ml-4"
        >
          Analyze Again
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Positive" value={`${results.sentiment.positive}%`} color="text-green-400" />
        <StatsCard title="Negative" value={`${results.sentiment.negative}%`} color="text-red-400" />
        <StatsCard title="Neutral" value={`${results.sentiment.neutral}%`} color="text-yellow-400" />
      </div>

      <div className="space-y-2">
        {results.categories.map((category) => (
          <CategoryAccordion key={category.category} category={category} />
        ))}
      </div>
      
      <ExportControls results={results} />
    </div>
  );
};

export default ResultsPanel;
