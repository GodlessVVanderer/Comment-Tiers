import React from 'react';
import { Comment } from '../types';
import { ThumbsUpIcon } from './Icons';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg">
      <img
        src={comment.authorProfileImageUrl}
        alt={`${comment.author}'s profile`}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-sm">{comment.author}</p>
          <p className="text-xs text-gray-400">
            {new Date(comment.publishedAt).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm mt-1">{comment.text}</p>
        <div className="flex items-center text-xs text-gray-400 mt-2">
          <ThumbsUpIcon />
          <span className="ml-1">{comment.likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
