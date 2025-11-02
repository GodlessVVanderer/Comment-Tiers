import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      {icon && <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">{icon}</div>}
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
