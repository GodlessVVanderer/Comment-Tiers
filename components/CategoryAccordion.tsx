import React, { useState, useEffect } from 'react';
import type { Category, Comment } from '../types';
import { CommentCard } from './CommentCard';
import { ChevronDownIcon, ChatBubbleIcon, PlusCircleIcon } from './Icons';

interface CategoryAccordionProps {
  category: Category;
  isLoading?: boolean;
  isInitiallyOpen?: boolean;
  onAddReply: (categoryTitle: string, path: number[], newReplyText: string) => void;
}

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_MORE_INCREMENT = 15;


export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ 
  category, 
  isLoading = false, 
  isInitiallyOpen = false,
  onAddReply
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  useEffect(() => {
    // Reset the visible count when the accordion is closed to ensure it starts fresh on reopen.
    if (!isOpen) {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    }
  }, [isOpen]);

  const handleReply = (path: number[], newReplyText: string) => {
    onAddReply(category.categoryTitle, path, newReplyText);
  };

  const comments = category.comments || [];
  const visibleComments = comments.slice(0, visibleCount);

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
                  {visibleComments.map((comment, index) => (
                      <CommentCard 
                        key={comment.id} 
                        comment={comment} 
                        path={[index]}
                        onAddReply={handleReply}
                      />
                  ))}
                   {comments.length > visibleCount && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setVisibleCount(prev => prev + LOAD_MORE_INCREMENT)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-indigo-300 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                        Load More ({comments.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};