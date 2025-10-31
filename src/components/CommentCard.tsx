
import React from 'react';
import { Comment } from '../types';
import { HeartIcon } from './Icons';
import { formatNumber } from '../utils';

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="flex gap-3 py-3">
      <img
        src={comment.authorProfileImageUrl}
        alt={comment.author}
        className="w-8 h-8 rounded-full mt-1"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">{comment.author}</span>
          <span className="text-xs text-gray-500">{new Date(comment.publishedAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.text}</p>
        <div className="flex items-center gap-2 mt-1 text-gray-500">
          <HeartIcon className="w-4 h-4" />
          <span className="text-xs">{formatNumber(comment.likeCount)}</span>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-gray-700">
            {comment.replies.map(reply => (
              <CommentCard key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
