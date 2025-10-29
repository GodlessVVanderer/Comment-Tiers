import React from 'react';
import type { AnalysisStats } from '../types';
import { DocumentTextIcon, FilterIcon, CheckCircleIcon } from './Icons';

interface StatsCardProps {
  stats: AnalysisStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <DocumentTextIcon className="mx-auto h-8 w-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Comments</p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg">
          <FilterIcon className="mx-auto h-8 w-8 text-red-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.filtered.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Noise Filtered</p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg">
          <CheckCircleIcon className="mx-auto h-8 w-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.analyzed.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Comments Analyzed</p>
        </div>
        
      </div>
    </div>
  );
};