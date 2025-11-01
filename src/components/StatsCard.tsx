import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, description }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg text-center">
      <h4 className="text-sm text-gray-400">{label}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export default StatsCard;
