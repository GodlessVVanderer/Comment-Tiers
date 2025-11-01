import React from 'react';
// FIX: Use relative path for import
import { formatNumber } from '../utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center">
      {icon && <div className="mr-4 text-gray-400">{icon}</div>}
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{displayValue}</p>
      </div>
    </div>
  );
};

export default StatsCard;