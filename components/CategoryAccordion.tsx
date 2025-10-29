import React, { useState } from 'react';
import type { Category, Comment } from '../types';
import { CommentCard } from './CommentCard';
import { ChevronDownIcon, ChatBubbleIcon } from './Icons';

interface CategoryAccordionProps {
  category: Category;
  isLoading?: boolean;
  isInitiallyOpen?: boolean;
  onAddReply: (categoryTitle: string, path: number[], newReplyText: string) => void;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ 
  category, 
  isLoading = false, 
  isInitiallyOpen = false,
  onAddReply
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);

  const handleReply = (path: number[], newReplyText: string) => {
    onAddReply(category.categoryTitle, path, newReplyText);
  };

  const comments = category.comments || [];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left bg-gray-800 hover:bg-gray-700/50 transition-colors duration-200"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-indigo-300">{category.categoryTitle}</h3>
          <p className="text-sm text-gray-400 mt-1">{category.summary}</p>
        </div>
        <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <ChatBubbleIcon className="w-4 h-4" />
                <span>{isLoading ? '...' : comments.length}</span>
            </div>
            <ChevronDownIcon className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        style={{ display: 'grid' }}
      >
        <div className="overflow-hidden">
            <div className="p-4 bg-gray-900/50">
              {isLoading ? (
                <div className="flex items-center justify-center text-gray-400 h-24">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading comments...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment, index) => (
                      <CommentCard 
                        key={comment.id} 
                        comment={comment} 
                        path={[index]}
                        onAddReply={handleReply}
                      />
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};