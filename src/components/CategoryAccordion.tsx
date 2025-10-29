import React, { useState } from 'react';
import type { Category } from '../types';
import { ChevronDownIcon, ChatBubbleIcon, MagnifyingGlassIcon } from './Icons';
import { CommentCard } from './CommentCard';

interface CategoryAccordionItemProps {
  category: Category;
  isOpen: boolean;
  onToggle: () => void;
  onAddReply: (path: number[], newReplyText: string) => void;
  onEditComment: (path: number[], newText: string) => void;
}

const CategoryAccordionItem: React.FC<CategoryAccordionItemProps> = ({ category, isOpen, onToggle, onAddReply, onEditComment }) => {
  const [filter, setFilter] = useState('');
  
  const filteredComments = filter
    ? category.comments.filter(comment => 
        comment.text.toLowerCase().includes(filter.toLowerCase()) ||
        comment.author.toLowerCase().includes(filter.toLowerCase())
      )
    : category.comments;

  return (
    <div className="border border-gray-700/80 rounded-lg overflow-hidden bg-gray-800/60 shadow-md">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center flex-grow min-w-0">
          <ChatBubbleIcon className="w-5 h-5 mr-3 text-indigo-400 flex-shrink-0" />
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-white truncate">{category.categoryTitle}</h3>
            <p className="text-sm text-gray-400 mt-1">{category.summary}</p>
          </div>
        </div>
        <div className="flex items-center ml-4 flex-shrink-0">
          <span className="text-sm font-bold text-gray-300 bg-gray-700/80 px-2.5 py-1 rounded-full">{category.comments.length}</span>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 ml-3 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-gray-700/80">
            <div className="p-4 bg-gray-900/30">
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter comments..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full p-2 pl-8 bg-gray-900/70 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
            </div>
            <div className="p-4 bg-gray-900/50">
              <div className="space-y-4">
                {filteredComments.map((comment, index) => {
                  // Find the original index to maintain correct paths for actions
                  const originalIndex = category.comments.findIndex(c => c.id === comment.id);
                  return (
                    <CommentCard 
                      key={comment.id} 
                      comment={comment}
                      path={[originalIndex]} // Path for this top-level comment in the category
                      onAddReply={onAddReply}
                      onEditComment={onEditComment}
                    />
                  )
                })}
                {filteredComments.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-4">No comments match your filter.</p>
                )}
              </div>
            </div>
        </div>
      )}
    </div>
  );
};


interface CategoryListProps {
    categories: Category[];
    onAddReply: (categoryIndex: number, path: number[], newReplyText: string) => void;
    onEditComment: (categoryIndex: number, path: number[], newText: string) => void;
}

export const CategoryAccordion: React.FC<CategoryListProps> = ({ categories, onAddReply, onEditComment }) => {
    const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenCategoryIndex(openCategoryIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {categories.map((category, index) => (
                <CategoryAccordionItem
                    key={`${category.categoryTitle}-${index}`}
                    category={category}
                    isOpen={openCategoryIndex === index}
                    onToggle={() => handleToggle(index)}
                    onAddReply={(path, text) => onAddReply(index, path, text)}
                    onEditComment={(path, text) => onEditComment(index, path, text)}
                />
            ))}
        </div>
    );
};