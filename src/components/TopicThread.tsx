import React from 'react';
import { Topic } from '../types';
import CommentCard from './CommentCard';

interface TopicThreadProps {
    topic: Topic;
    videoId: string;
}

const TopicThread: React.FC<TopicThreadProps> = ({ topic, videoId }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">{topic.title}</h3>
            <p className="text-sm italic text-gray-600 mb-4">"{topic.summary}"</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {topic.comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} videoId={videoId} depth={0} />
                ))}
            </div>
        </div>
    );
};

export default TopicThread;
