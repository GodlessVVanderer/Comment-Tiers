import React from 'react';
import { useAppStore } from '../store';

const ExportControls: React.FC = () => {
  const { analysisResult } = useAppStore();

  const downloadJSON = () => {
    if (!analysisResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "comment_analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const downloadCSV = () => {
    if (!analysisResult) return;

    let csvContent = "category,author,comment,likes,replies,date\n";
    analysisResult.categories.forEach(category => {
      category.comments.forEach(comment => {
        const row = [
          `"${category.name.replace(/"/g, '""')}"`,
          `"${comment.author.replace(/"/g, '""')}"`,
          `"${comment.text.replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`,
          comment.likeCount,
          comment.replyCount,
          comment.publishedAt,
        ].join(',');
        csvContent += row + "\n";
      });
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "comment_analysis.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center gap-4">
      <h4 className="text-md font-bold">Export Results:</h4>
      <button onClick={downloadJSON} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm">
        Export as JSON
      </button>
      <button onClick={downloadCSV} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm">
        Export as CSV
      </button>
    </div>
  );
};

export default ExportControls;
