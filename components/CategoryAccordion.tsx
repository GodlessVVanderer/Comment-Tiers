import React, { useState, useEffect, useMemo } from 'react';
import type { Category, Comment } from '../types';
import { CommentCard } from './CommentCard';
import { ChevronDownIcon, ChatBubbleIcon, PlusCircleIcon, MagnifyingGlassIcon } from './Icons';

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
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    // Reset state when the accordion is closed.
    if (!isOpen) {
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      setFilterText('');
    }
  }, [isOpen]);

  const handleReply = (path: number[], newReplyText: string) => {
    onAddReply(category.categoryTitle, path, newReplyText);
  };

  const comments = category.comments || [];

  const filteredComments = useMemo(() => {
    if (!filterText.trim()) {
      return comments;
    }
    const lowercasedFilter = filterText.toLowerCase();
    return comments.filter(comment => 
      comment.author.toLowerCase().includes(lowercasedFilter) ||
      comment.text.toLowerCase().includes(lowercasedFilter)
    );
  }, [comments, filterText]);

  const visibleComments = filteredComments.slice(0, visibleCount);

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
              <div className="relative mb-4">
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setVisibleCount(INITIAL_VISIBLE_COUNT); // Reset pagination on filter change
                  }}
                  placeholder="Filter comments by keyword..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center text-gray-400 h-24">
                  {/* ... loading spinner ... */}
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleComments.length > 0 ? (
                    visibleComments.map((comment) => (
                      <CommentCard 
                        key={comment.id} 
                        comment={comment} 
                        path={[comments.findIndex(c => c.id === comment.id)]}
                        onAddReply={handleReply}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No comments match your filter.</p>
                  )}
                   {filteredComments.length > visibleCount && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setVisibleCount(prev => prev + LOAD_MORE_INCREMENT)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-indigo-300 text-sm font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                        Load More ({filteredComments.length - visibleCount} remaining)
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