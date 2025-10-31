
import React from 'react';
import { useAppStore } from '../../src/store';
import { StatsCard } from '../../src/components/StatsCard';
import { CategoryAccordion } from '../../src/components/CategoryAccordion';
import { formatDuration } from '../../src/utils';
import {
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from '../../src/components/Icons';
import { ExportControls } from '../../src/components/ExportControls';
import { DonationCTA } from '../../src/components/DonationCTA';
import { LiveConversation } from '../../src/components/LiveConversation';

export const ResultsPanel: React.FC = () => {
  const { results, stats, analyze, videoId } = useAppStore();

  const handleReanalyze = () => {
    if (videoId) {
        analyze(videoId);
    }
  };

  if (!stats) return null;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Comments Fetched"
          value={stats.totalCommentsFetched}
          icon={<MagnifyingGlassIcon className="w-6 h-6" />}
        />
        <StatsCard
          label="Comments Analyzed"
          value={stats.totalCommentsAnalyzed}
          icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />}
        />
        <StatsCard
          label="Total Likes"
          value={stats.totalLikesOnAnalyzedComments}
          icon={<HeartIcon className="w-6 h-6" />}
        />
        <StatsCard
          label="Analysis Time"
          value={formatDuration(stats.analysisDurationSeconds)}
          icon={<ClockIcon className="w-6 h-6" />}
        />
      </div>

      <div className="space-y-2">
        {results.map((category) => (
          <CategoryAccordion key={category.name} category={category} />
        ))}
      </div>
      
      <ExportControls />
      <LiveConversation />
      <DonationCTA />

       <div className="mt-6 text-center">
         <button onClick={handleReanalyze} className="text-sm text-gray-400 hover:text-white hover:underline">
            Analyze again with different settings
         </button>
       </div>
    </div>
  );
};
