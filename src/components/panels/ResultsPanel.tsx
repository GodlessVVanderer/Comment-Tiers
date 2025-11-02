import React from 'react';
import { AnalysisResult, VideoDetails } from '../../types';
import { useAppStore } from '../../store';
import StatsCard from '../StatsCard';
import CategoryAccordion from '../CategoryAccordion';
import { ChartBarIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, ArrowPathIcon } from '../Icons';
import { formatNumber } from '../../utils';


interface ResultsPanelProps {
    result: AnalysisResult;
    videoDetails: VideoDetails;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, videoDetails }) => {
    const { actions } = useAppStore();

    return (
        <div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{videoDetails.title}</h2>
                    <p className="text-sm text-gray-500">by {videoDetails.author}</p>
                </div>
                 <button 
                    onClick={actions.reset}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline flex-shrink-0"
                >
                     <ArrowPathIcon />
                    <span>Analyze Another</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                <StatsCard label="Views" value={formatNumber(videoDetails.viewCount)} />
                <StatsCard label="Likes" value={formatNumber(videoDetails.likeCount)} />
                <StatsCard label="Comments" value={formatNumber(videoDetails.commentCount)} />
            </div>

            <div className="mb-4 p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <DocumentTextIcon />
                    Overall Summary
                </h3>
                <p className="text-sm text-gray-600">{result.summary}</p>
            </div>

            <div className="mb-4 p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <ChartBarIcon />
                    Sentiment
                </h3>
                <div className="flex justify-around text-center text-sm">
                    <div>
                        <p className="font-bold text-green-600">{result.sentiment.positive.toFixed(1)}%</p>
                        <p className="text-gray-500">Positive</p>
                    </div>
                    <div>
                        <p className="font-bold text-red-600">{result.sentiment.negative.toFixed(1)}%</p>
                        <p className="text-gray-500">Negative</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-600">{result.sentiment.neutral.toFixed(1)}%</p>
                        <p className="text-gray-500">Neutral</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <ChatBubbleLeftRightIcon />
                    Comment Topics
                </h3>
                {result.topics.map((topic, index) => (
                    <CategoryAccordion key={index} topic={topic} videoId={videoDetails.id} />
                ))}
            </div>
        </div>
    );
};

export default ResultsPanel;
