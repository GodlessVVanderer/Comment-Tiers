import React from 'react';
import { AnalysisResults } from '../types';

interface ExportControlsProps {
  results: AnalysisResults;
}

const ExportControls: React.FC<ExportControlsProps> = ({ results }) => {
  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(results, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'comment-analysis.json';
    link.click();
  };

  return (
    <div className="mt-6 border-t border-gray-700 pt-4 flex justify-end">
      <button
        onClick={handleExportJson}
        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md"
      >
        Export as JSON
      </button>
    </div>
  );
};

export default ExportControls;
