import React from 'react';
import { formatNumber } from '@/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-start justify-between">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-white mt-2">{displayValue}</p>
    </div>
  );
};
