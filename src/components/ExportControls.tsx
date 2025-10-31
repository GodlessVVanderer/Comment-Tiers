import React from 'react';
// FIX: Use relative paths for imports
import { Category } from '../types';
import { ArrowDownTrayIcon } from './Icons';

interface ExportControlsProps {
  categories: Category[];
}

const ExportControls: React.FC<ExportControlsProps> = ({ categories }) => {
  
  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(categories, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'comment-analysis.json';
    link.click();
  };

  const convertToCSV = () => {
    let csv = 'Category,Summary,Comment Author,Comment Text,Likes,Published At\n';
    categories.forEach(category => {
        category.comments.forEach(comment => {
            const row = [
                `"${category.category}"`,
                `"${category.summary.replace(/"/g, '""')}"`,
                `"${comment.author.replace(/"/g, '""')}"`,
                `"${comment.text.replace(/"/g, '""')}"`,
                comment.likeCount,
                comment.publishedAt
            ].join(',');
            csv += row + '\n';
        });
    });
    return csv;
  };

  const handleExportCsv = () => {
    const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(convertToCSV())}`;
    const link = document.createElement('a');
    link.href = csvString;
    link.download = 'comment-analysis.csv';
    link.click();
  };


  return (
    <div className="mt-6 border-t border-gray-700 pt-4 flex justify-end gap-4">
      <button
        onClick={handleExportJson}
        className="flex items-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md"
      >
        <ArrowDownTrayIcon className="mr-2" />
        Export as JSON
      </button>
      <button
        onClick={handleExportCsv}
        className="flex items-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md"
      >
        <ArrowDownTrayIcon className="mr-2" />
        Export as CSV
      </button>
    </div>
  );
};

export default ExportControls;
