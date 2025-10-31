import React, { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { PencilIcon, CheckIcon, XMarkIcon } from '@/components/Icons';

interface CommentCardProps {
  comment: Comment;
  path: string;
  onAddReply: (path: string, text: string) => void;
  onEditComment: (path: string, newText: string) => void;
  isReply?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, path, onAddReply, onEditComment, isReply = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(comment.text);

  useEffect(() => {
    setEditText(comment.text);
  }, [comment.text]);
  
  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onAddReply(path, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEditComment(path, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${isReply ? 'ml-8' : ''}`}>
      <img src={comment.authorProfileImageUrl} alt={comment.author} className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        <div className="p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-semibold text-white">{comment.author}</p>
                    <p className="text-xs text-gray-400">{new Date(comment.publishedAt).toLocaleDateString()}</p>
                    {comment.isEditable && <span className="text-xs text-blue-400">(Edited)</span>}
                </div>
                {comment.isEditable && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white">
                        <PencilIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isEditing ? (
                <div>
                    <textarea 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-2 text-sm text-white"
                        rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><XMarkIcon className="w-5 h-5"/></button>
                        <button onClick={handleEditSubmit} className="text-green-400 hover:text-white"><CheckIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
            )}
        </div>
        
        {!isEditing && (
            <div className="flex items-center space-x-4 mt-2 pl-2">
                <button onClick={() => setIsReplying(!isReplying)} className="text-xs text-gray-400 hover:text-white">
                    Reply
                </button>
            </div>
        )}

        {isReplying && (
          <div className="mt-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to ${comment.author}...`}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsReplying(false)} className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded">Cancel</button>
              <button onClick={handleReplySubmit} className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded">Submit</button>
            </div>
          </div>
        )}

        <div className="mt-3 space-y-3">
            {comment.replies?.map((reply, index) => (
                <CommentCard 
                    key={reply.id} 
                    comment={reply} 
                    path={`${path}:replies:${index}`}
                    onAddReply={onAddReply}
                    onEditComment={onEditComment}
                    isReply 
                />
            ))}
        </div>
      </div>
    </div>
  );
};
