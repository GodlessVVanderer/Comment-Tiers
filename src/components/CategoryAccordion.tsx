import React, { useState, useMemo } from 'react';
import { Category, Comment } from '@/types';
import { CommentCard } from '@/components/CommentCard';
import { ChevronUpIcon, ChevronDownIcon, PlusCircleIcon, MagnifyingGlassIcon } from '@/components/Icons';

interface CategoryAccordionProps {
  category: Category;
  onAddReply: (path: string, text: string) => void;
  onEditComment: (path: string, newText: string) => void;
  onAddComment: (categoryName: string, text: string) => void;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ category, onAddReply, onEditComment, onAddComment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [filterText, setFilterText] = useState('');

  const filteredComments = useMemo(() => {
    if (!filterText) return category.comments;
    const lowerFilter = filterText.toLowerCase();
    return category.comments.filter(c => 
        c.text.toLowerCase().includes(lowerFilter) || 
        c.author.toLowerCase().includes(lowerFilter)
    );
  }, [category.comments, filterText]);

  if (category.comments.length === 0 && !showAddComment) return null;

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      onAddComment(category.name, newCommentText);
      setNewCommentText('');
      setShowAddComment(false);
      setIsOpen(true);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center">
          <span className="text-lg mr-3">{category.icon}</span>
          <span className="font-semibold text-white">{category.name}</span>
          <span className="ml-2 text-sm text-gray-400">({category.comments.length})</span>
        </div>
        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-900">
            <div className="flex gap-2 mb-4">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                    <input
                        type="text"
                        placeholder="Filter comments..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={() => setShowAddComment(!showAddComment)}
                    className="flex-shrink-0 flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-1" />
                    Add
                </button>
            </div>
            {showAddComment && (
                <div className="mb-4">
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a new comment..."
                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm text-white"
                        rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setShowAddComment(false)} className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded">Cancel</button>
                        <button onClick={handleAddComment} className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded">Add Comment</button>
                    </div>
                </div>
            )}
            <div className="space-y-3">
              {filteredComments.map((comment, index) => (
                <CommentCard 
                  key={comment.id} 
                  comment={comment} 
                  path={`${category.name}:${index}`}
                  onAddReply={onAddReply}
                  onEditComment={onEditComment}
                />
              ))}
              {filteredComments.length === 0 && filterText && (
                  <p className="text-sm text-gray-500 text-center py-4">No comments match your filter.</p>
              )}
            </div>
        </div>
      )}
    </div>
  );
};
