import React from 'react';
import { YouTubeComment } from '../types';

interface CommentCardProps {
  comment: YouTubeComment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <div className="p-3 bg-gray-800 rounded-lg flex items-start gap-4">
      <img src={comment.authorProfileImageUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">{comment.author}</span>
          <span className="text-gray-400">{new Date(comment.publishedAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
          <span>Likes: {comment.likeCount}</span>
          <span>Replies: {comment.replyCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
