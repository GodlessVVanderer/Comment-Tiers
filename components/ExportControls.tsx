import React from 'react';
import type { Category, AnalysisStats } from '../types';

interface ExportControlsProps {
  categories: Category[];
  stats: AnalysisStats | null;
  videoId: string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ categories, stats, videoId }) => {
  if (!categories.length || !stats) {
    return null;
  }

  const downloadJSON = () => {
    const data = {
      analysisStats: stats,
      categories: categories,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `youtube-comment-analysis-${videoId}.json`;
    link.click();
  };

  const downloadCSV = () => {
    const rows = [['Category', 'Summary', 'Comment ID', 'Author', 'Comment Text']];
    categories.forEach(category => {
      category.comments.forEach(comment => {
        rows.push([
          `"${category.categoryTitle.replace(/"/g, '""')}"`,
          `"${category.summary.replace(/"/g, '""')}"`,
          comment.id,
          `"${comment.author.replace(/"/g, '""')}"`,
          `"${comment.text.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        ]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `youtube-comment-analysis-${videoId}.csv`);
    link.click();
  };

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 my-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h3 className="text-md font-semibold text-white mb-3 sm:mb-0">Export Results</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadJSON}
            className="px-4 py-2 bg-gray-700 text-indigo-300 text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
          >
            Export as JSON
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-gray-700 text-indigo-300 text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
          >
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};
