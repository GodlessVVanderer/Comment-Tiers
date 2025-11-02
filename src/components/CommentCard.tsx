import React from 'react';
import { Comment } from '../types';
import { ThumbsUpIcon } from './Icons';
import { formatNumber } from '../utils';

interface CommentCardProps {
    comment: Comment;
    videoId: string;
    depth: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, videoId, depth }) => {
    // FIX: Create a link to the specific comment.
    const commentUrl = `https://www.youtube.com/watch?v=${videoId}&lc=${comment.id}`;

    return (
        <div className={`flex items-start space-x-3 p-2 rounded-lg ${depth > 0 ? 'ml-4 mt-2 bg-gray-50' : ''}`}>
            <img 
                src={comment.authorProfileImageUrl} 
                alt={comment.author} 
                className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <a href={comment.authorChannelUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-700 hover:underline">
                        {comment.author}
                    </a>
                    <a href={commentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">
                        {new Date(comment.publishedAt).toLocaleDateString()}
                    </a>
                </div>
                <p className="text-sm text-gray-800 mt-1">{comment.text}</p>
                <div className="flex items-center space-x-2 text-gray-500 mt-2">
                    <ThumbsUpIcon />
                    <span className="text-xs">{formatNumber(comment.likeCount)}</span>
                </div>
                {/* Recursively render replies */}
                {comment.replies && comment.replies.map(reply => (
                    <CommentCard key={reply.id} comment={reply} videoId={videoId} depth={depth + 1} />
                ))}
            </div>
        </div>
    );
};

export default CommentCard;
