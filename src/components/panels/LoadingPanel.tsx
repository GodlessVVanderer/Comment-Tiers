import React from 'react';
import { LoadingSpinner } from '../Icons';

const LoadingPanel = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoadingSpinner className="w-12 h-12 mb-4" />
      <p className="text-lg">Analyzing comments... this may take a moment.</p>
    </div>
  );
};

export default LoadingPanel;
