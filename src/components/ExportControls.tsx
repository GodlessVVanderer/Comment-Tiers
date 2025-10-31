import React from 'react';
import { useAppStore } from '../store';
import { Category, Comment } from '../types';
import { ArrowDownTrayIcon } from './Icons';

export const ExportControls: React.FC = () => {
  const { results, stats } = useAppStore();

  const handleExportJson = () => {
    const data = {
      stats,
      categories: results,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'comment_analysis.json';
    link.click();
  };

  const handleExportCsv = () => {
    const rows = [['Category', 'Summary', 'Comment ID', 'Author', 'Comment Text', 'Likes', 'Is Reply']];
    
    results.forEach((category: Category) => {
        category.comments.forEach((comment: Comment) => {
            rows.push([
                `"${category.name}"`,
                `"${category.summary.replace(/"/g, '""')}"`,
                `"${comment.id}"`,
                `"${comment.author}"`,
                `"${comment.text.replace(/"/g, '""')}"`,
                comment.likeCount.toString(),
                'FALSE',
            ]);
            if(comment.replies) {
                comment.replies.forEach((reply: Comment) => {
                    rows.push([
                        `"${category.name}"`,
                        `"${category.summary.replace(/"/g, '""')}"`,
                        `"${reply.id}"`,
                        `"${reply.author}"`,
                        `"${reply.text.replace(/"/g, '""')}"`,
                        reply.likeCount.toString(),
                        'TRUE',
                    ]);
                });
            }
        });
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "comment_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={handleExportJson}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        Export as JSON
      </button>
      <button
        onClick={handleExportCsv}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        Export as CSV
      </button>
    </div>
  );
};
