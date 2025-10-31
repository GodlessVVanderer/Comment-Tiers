import React from 'react';
import { useStore } from '@/store';
import { Comment } from '@/types';
import { ArrowDownTrayIcon } from '@/components/Icons';

export const ExportControls = () => {
  const analysisResult = useStore(state => state.analysisResult);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!analysisResult) return;
    const jsonString = JSON.stringify(analysisResult, null, 2);
    downloadFile('comment-analysis.json', jsonString, 'application/json');
  };

  const handleExportCsv = () => {
    if (!analysisResult) return;
    
    let csvContent = 'Category,Author,Date,Likes,Text,Is Reply,Reply To Author\n';
    
    const flattenComments = (comments: Comment[], category: string, replyToAuthor = ''): string => {
        let csvRows = '';
        comments.forEach(comment => {
            const text = `"${comment.text.replace(/"/g, '""')}"`;
            csvRows += `${category},${comment.author},${comment.publishedAt},${comment.likeCount},${text},${replyToAuthor ? 'Yes' : 'No'},${replyToAuthor}\n`;
            if (comment.replies && comment.replies.length > 0) {
                csvRows += flattenComments(comment.replies, category, comment.author);
            }
        });
        return csvRows;
    };
    
    analysisResult.categories.forEach(category => {
        csvContent += flattenComments(category.comments, category.name);
    });

    downloadFile('comment-analysis.csv', csvContent, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={handleExportJson} className="flex items-center px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded">
        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
        JSON
      </button>
      <button onClick={handleExportCsv} className="flex items-center px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded">
        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
        CSV
      </button>
    </div>
  );
};
