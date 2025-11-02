// FIX: Replaced placeholder text with a functional React component.
import React from 'react';
import { formatNumber } from '../utils';

interface StatsCardProps {
    title: string;
    value: number | string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
    return (
        <div className="border p-4 rounded-lg bg-white shadow">
            <h4 className="text-gray-500">{title}</h4>
            <p className="text-2xl font-bold">{typeof value === 'number' ? formatNumber(value) : value}</p>
        </div>
    );
};

export default StatsCard;
