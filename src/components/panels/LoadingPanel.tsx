import React from 'react';
import { useAppStore } from '../../store';
import { formatEta } from '../../utils';

const LoadingPanel: React.FC = () => {
  const { progress } = useAppStore();

  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold mb-4">{progress.text}</h2>
      <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress.value}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-400">{formatEta(progress.eta)}</p>
    </div>
  );
};

export default LoadingPanel;
