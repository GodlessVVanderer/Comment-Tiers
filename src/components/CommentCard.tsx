import React, { useState } from 'react';
import { Comment } from '../types';
import { ThumbsUpIcon, PencilIcon, CheckIcon, XMarkIcon } from './Icons';

interface CommentCardProps {
  comment: Comment;
  onAddReply: (commentId: string, text: string) => void;
  onEditComment: (commentId: string, text: string, replyId?: string) => void;
  onLoadMoreReplies: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onAddReply, onEditComment, onLoadMoreReplies }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleSaveEdit = () => {
    onEditComment(comment.id, editText);
    setIsEditing(false);
  };

  const handleSaveReply = () => {
    onAddReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
  };
  
  const publishedDate = new Date(comment.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 p-3 rounded-lg">
      <div className="flex items-start">
        <img src={comment.authorProfileImageUrl} alt={comment.author} className="w-8 h-8 rounded-full mr-3" />
        <div className="flex-1">
          <div className="flex items-center text-xs text-gray-400">
            <span className="font-bold text-gray-300 text-sm mr-2">{comment.author}</span>
            <span>{publishedDate}</span>
          </div>
          {isEditing ? (
             <div className="mt-1">
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm"
                    rows={3}
                />
                <div className="flex gap-2 mt-1">
                    <button onClick={handleSaveEdit} className="text-green-400"><CheckIcon /></button>
                    <button onClick={() => setIsEditing(false)} className="text-red-400"><XMarkIcon /></button>
                </div>
             </div>
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center">
              <ThumbsUpIcon className="mr-1" /> {comment.likeCount}
            </span>
            <button onClick={() => setIsReplying(!isReplying)} className="hover:underline">Reply</button>
            {comment.isEditable && !isEditing && (
              <button onClick={() => { setIsEditing(true); setEditText(comment.text); }} className="hover:underline flex items-center"><PencilIcon className="mr-1"/> Edit</button>
            )}
          </div>
           {isReplying && (
             <div className="mt-2">
                 <textarea
                    placeholder={`Replying to ${comment.author}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-sm"
                 />
                 <div className="flex gap-2 mt-1">
                    <button onClick={handleSaveReply} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Post Reply</button>
                    <button onClick={() => setIsReplying(false)} className="text-xs hover:underline">Cancel</button>
                 </div>
             </div>
           )}
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="mt-3 pl-11 space-y-3">
          {comment.replies.map(reply => (
             <CommentCard key={reply.id} comment={{...reply, replies: []}} onAddReply={onAddReply} onEditComment={onEditComment} onLoadMoreReplies={onLoadMoreReplies} />
          ))}
        </div>
      )}
      {comment.totalReplyCount > (comment.replies?.length ?? 0) && (
         <div className="pl-11 mt-2">
            <button
                onClick={() => onLoadMoreReplies(comment.id)}
                className="text-blue-400 text-xs hover:underline"
                disabled={comment.isRepliesLoading}
            >
                {comment.isRepliesLoading ? 'Loading...' : `View ${comment.totalReplyCount - (comment.replies?.length ?? 0)} more replies`}
            </button>
         </div>
      )}
    </div>
  );
};

export default CommentCard;
