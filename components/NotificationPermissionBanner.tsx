import React from 'react';
import { BellIcon, CheckCircleIcon } from './Icons';

interface NotificationPermissionBannerProps {
  onRequestPermission: () => void;
}

export const NotificationPermissionBanner: React.FC<NotificationPermissionBannerProps> = ({ onRequestPermission }) => {
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <BellIcon className="w-6 h-6 text-indigo-400 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-white">Get notified when it's done</h4>
          <p className="text-sm text-gray-400">Allow notifications to get an alert when the analysis is complete.</p>
        </div>
      </div>
      <button
        onClick={onRequestPermission}
        className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
      >
        <CheckCircleIcon className="w-5 h-5" />
        Enable
      </button>
    </div>
  );
};
