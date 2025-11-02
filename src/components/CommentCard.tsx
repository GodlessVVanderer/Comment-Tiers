import React from 'react';
import { Comment } from '../types';
import { ThumbsUpIcon } from './Icons';

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
    return (
        <div className="flex items-start gap-3 p-2 my-2 bg-white rounded-md shadow-sm">
            <img src={comment.authorProfileImageUrl} alt={comment.author} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-gray-500">{new Date(comment.publishedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-800 mt-1" dangerouslySetInnerHTML={{ __html: comment.text.replace(/\n/g, '<br />') }} />
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <ThumbsUpIcon className="w-4 h-4" />
                    <span>{comment.likeCount}</span>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
