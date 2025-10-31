import React from 'react';
import { useStore } from '../../store';
import { StatsCard } from '../StatsCard';
import { CategoryAccordion } from '../CategoryAccordion';
import { CommentCard } from '../CommentCard';
import { DonationCTA } from '../DonationCTA';
import { ExportControls } from '../ExportControls';
import { LiveConversation } from '../LiveConversation';

export const ResultsPanel: React.FC = () => {
    const { analysisResult, view, setView, reset, addReply, editComment, addComment } = useStore();

    if (!analysisResult) return null;

    const { summary, stats, categories, topComments } = analysisResult;

    const renderView = () => {
        switch (view) {
            case 'stats':
                return (
                    <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <StatsCard title="Total Comments Fetched" value={stats.totalComments} />
                            <StatsCard title="Spam/Duplicates Filtered" value={stats.filteredComments} />
                            <StatsCard title="Comments Analyzed" value={stats.analyzedComments} />
                        </div>
                        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white">Analysis Summary</h3>
                            <p className="text-sm text-gray-300 mt-2">{summary}</p>
                        </div>
                        <div className="mt-6">
                             <h3 className="text-lg font-semibold text-white mb-3">Top Liked Comments</h3>
                             <div className="space-y-3">
                                {topComments.map((comment) => (
                                    <CommentCard key={comment.id} comment={comment} path="" onAddReply={() => {}} onEditComment={() => {}} />
                                ))}
                             </div>
                        </div>
                        <div className="mt-8">
                            <DonationCTA />
                        </div>
                    </div>
                );
            case 'comments':
                 return (
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <CategoryAccordion key={category.name} category={category} onAddReply={addReply} onEditComment={editComment} onAddComment={addComment} />
                        ))}
                    </div>
                );
            case 'live':
                return <LiveConversation />;
            default:
                return null;
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-1 border border-gray-700 rounded-lg p-1">
                    <button onClick={() => setView('stats')} className={`px-3 py-1 text-sm rounded-md ${view === 'stats' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                        Stats
                    </button>
                    <button onClick={() => setView('comments')} className={`px-3 py-1 text-sm rounded-md ${view === 'comments' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                        Comments
                    </button>
                     <button onClick={() => setView('live')} className={`px-3 py-1 text-sm rounded-md ${view === 'live' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
                        Live Chat
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <ExportControls />
                    <button onClick={reset} className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-md">
                        Start Over
                    </button>
                </div>
            </div>
            {renderView()}
        </div>
    );
};
