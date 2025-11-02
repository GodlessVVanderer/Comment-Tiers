import React from 'react';
import { Comment } from '../types';
import CommentCard from './CommentCard';

interface TopicThreadProps {
    topic: string;
    comments: Comment[];
}

const TopicThread: React.FC<TopicThreadProps> = ({ topic, comments }) => {
    return (
        <div>
            <h3 className="text-md font-semibold mb-2">{topic}</h3>
            <div className="space-y-2">
                {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default TopicThread;
