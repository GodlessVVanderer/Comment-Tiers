import React, { useState, useEffect } from 'react';
import type { Comment } from '../types';
import { ReplyIcon, SendIcon, PencilIcon, CheckIcon, XMarkIcon } from './Icons';

interface CommentCardProps {
  comment: Comment;
  path: number[];
  onAddReply: (path: number[], newReplyText: string) => void;
  onEditComment: (path: number[], newText: string) => void;
  isReply?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, path, onAddReply, onEditComment, isReply = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  // Ensure the editText state is updated if the comment prop changes.
  useEffect(() => {
    setEditText(comment.text);
  }, [comment.text]);

  const handlePostReply = () => {
    if (replyText.trim()) {
      onAddReply(path, replyText.trim());
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEditComment(path, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };
  
  const cardClasses = `bg-gray-800 p-3 rounded-md border border-gray-700/60 ${isReply ? 'ml-4 lg:ml-6' : ''}`;
  
  return (
    <div className="relative">
      {isReply && <div className="absolute left-0 top-0 w-4 h-full border-l-2 border-b-2 border-gray-700/50 rounded-bl-lg -translate-x-4"></div>}
      <div className={cardClasses}>
        <p className="text-sm font-semibold text-gray-300 mb-1">{comment.author}</p>

        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>
        ) : (
          <p className="text-gray-400 text-sm whitespace-pre-wrap">{comment.text}</p>
        )}
        
        <div className="mt-2 flex items-center gap-4">
          {isEditing ? (
            <>
              <button 
                onClick={handleSaveEdit} 
                className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
              >
                <CheckIcon className="w-4 h-4" /> Save
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <ReplyIcon className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <PencilIcon className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </>
          )}
        </div>

        {isReplying && (
          <div className="mt-2 flex items-start gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to ${comment.author}...`}
              rows={2}
              className="w-full flex-grow px-3 py-2 bg-gray-900/70 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
              autoFocus
            />
            <button
              onClick={handlePostReply}
              disabled={!replyText.trim()}
              className="flex-shrink-0 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Post Reply"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply, index) => (
              <CommentCard 
                key={reply.id} 
                comment={reply}
                path={[...path, index]}
                onAddReply={onAddReply}
                onEditComment={onEditComment}
                isReply 
              />
            ))}
          </div>
      )}
    </div>
  );
};