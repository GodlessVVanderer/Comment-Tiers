import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
