import React, { useState } from 'react';
import { CommentCategory } from '../types';
import CommentCard from './CommentCard';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface CategoryAccordionProps {
  category: CommentCategory;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <h4 className="font-bold text-lg">{category.category}</h4>
          <span className="ml-2 bg-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
            {category.comments.length}
          </span>
        </div>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-600">
          <p className="text-gray-400 italic mb-4">{category.summary}</p>
          <div className="space-y-4">
            {category.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
