import React, { useState } from 'react';
// FIX: Changed Category to Topic to match the data structure from the Gemini API analysis.
import { Topic } from '../types';
import CommentCard from './CommentCard';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface CategoryAccordionProps {
    // FIX: Changed category prop to topic and added videoId to pass to child components.
    topic: Topic;
    videoId: string;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ topic, videoId }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border rounded-lg mb-2 bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50"
            >
                <div>
                    {/* FIX: Updated to use properties from the Topic type (title, comments.length, summary). */}
                    <h3 className="font-semibold text-gray-800">{topic.title} ({topic.comments.length})</h3>
                    {topic.summary && <p className="text-sm text-gray-500 italic mt-1">"{topic.summary}"</p>}
                </div>
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {isOpen && (
                <div className="p-3 border-t max-h-60 overflow-y-auto">
                    {topic.comments.map(comment => (
                        // FIX: Added missing videoId and depth props to CommentCard.
                        <CommentCard key={comment.id} comment={comment} videoId={videoId} depth={0} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryAccordion;
