import React from 'react';
import { formatNumber } from '../utils';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
      {icon && <div className="mr-4 text-blue-400">{icon}</div>}
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-2xl font-bold text-white">
          {typeof value === 'number' ? formatNumber(value) : value}
        </div>
      </div>
    </div>
  );
};
