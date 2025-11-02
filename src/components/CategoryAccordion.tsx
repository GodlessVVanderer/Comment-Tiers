// FIX: Replaced placeholder text with a functional React component.
import React from 'react';
import { Comment } from '../types';
import CommentCard from './CommentCard';

interface CategoryAccordionProps {
  title: string;
  comments: Comment[];
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ title, comments }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-2 font-semibold">
        {title} ({comments.length})
      </button>
      {isOpen && (
        <div className="p-2 bg-gray-100">
          {comments.map((comment, index) => (
            <CommentCard key={comment.id || index} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
