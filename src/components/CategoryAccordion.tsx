import React, { useState } from 'react';
import { CommentCategory } from '../types';
import CommentCard from './CommentCard';
import { ChevronDownIcon } from './Icons';

interface CategoryAccordionProps {
  category: CommentCategory;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (category.count === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700"
      >
        <div>
          <h3 className="text-lg font-bold">{category.name} ({category.count})</h3>
          <p className="text-sm text-gray-400">{category.description}</p>
        </div>
        <ChevronDownIcon className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-900">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {category.comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
