
import React, { useState } from 'react';
import type { Category } from '../types';
import { ChevronDownIcon, ChatBubbleIcon } from './Icons';
import { CommentCard } from './CommentCard';

interface CategoryAccordionItemProps {
  category: Category;
  isOpen: boolean;
  onToggle: () => void;
  onAddReply: (path: number[], newReplyText: string) => void;
  onEditComment: (path: number[], newText: string) => void;
}

const CategoryAccordionItem: React.FC<CategoryAccordionItemProps> = ({ category, isOpen, onToggle, onAddReply, onEditComment }) => {
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
        <div className="p-4 bg-gray-900/50 border-t border-gray-700/80">
          <div className="space-y-4">
            {category.comments.map((comment, index) => (
              <CommentCard 
                key={comment.id} 
                comment={comment}
                path={[index]} // Path for this top-level comment in the category
                onAddReply={onAddReply}
                onEditComment={onEditComment}
              />
            ))}
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
