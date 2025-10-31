
import React, { useState } from 'react';
import { Category } from '../types';
import { ChevronDownIcon, ChatBubbleBottomCenterTextIcon } from './Icons';
import { CommentCard } from './CommentCard';

interface CategoryAccordionProps {
  category: Category;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg">
      <button
        className="w-full flex justify-between items-center p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="font-semibold text-white">{category.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{category.summary}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-400">
                <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                {category.comments.length}
            </div>
            <ChevronDownIcon
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-2 divide-y divide-gray-700">
          {category.comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
