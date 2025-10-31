import React, { useState } from 'react';
// FIX: Use relative paths for imports
import { useAppStore } from '../store';
import { Category } from '../types';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PlusCircleIcon } from './Icons';
import CommentCard from './CommentCard';

interface CategoryAccordionProps {
  categoryData: Category;
  isOpen: boolean;
  onToggle: () => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ categoryData, isOpen, onToggle }) => {
  const [filter, setFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const { actions } = useAppStore();

  const filteredComments = categoryData.comments.filter(c =>
    c.text.toLowerCase().includes(filter.toLowerCase()) ||
    c.author.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddReply = (commentId: string, text: string) => {
    actions.addReply(categoryData.category, commentId, text);
  };

  const handleEditComment = (commentId: string, text: string, replyId?: string) => {
    actions.editComment(categoryData.category, commentId, text, replyId);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };
  
  const onLoadMoreReplies = (commentId: string) => {
    actions.loadMoreReplies(categoryData.category, commentId);
  };


  return (
    <div className="bg-gray-700 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center">
          <h4 className="font-bold text-lg">{categoryData.category}</h4>
          <span className="ml-2 bg-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
            {categoryData.comments.length}
          </span>
        </div>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-600">
          <p className="text-gray-400 italic mb-4 whitespace-pre-wrap">{categoryData.summary || 'No summary available.'}</p>
          
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter comments..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 pl-10 text-sm"
            />
          </div>

          <div className="space-y-4">
            {filteredComments.slice(0, visibleCount).map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onAddReply={handleAddReply}
                onEditComment={handleEditComment}
                onLoadMoreReplies={onLoadMoreReplies}
              />
            ))}
          </div>

          {filteredComments.length > visibleCount && (
            <div className="text-center mt-4">
              <button
                onClick={handleLoadMore}
                className="text-blue-400 hover:underline flex items-center justify-center mx-auto text-sm"
              >
                <PlusCircleIcon className="mr-1" />
                Load More Comments
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;