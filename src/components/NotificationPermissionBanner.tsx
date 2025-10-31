import React, { useState, useEffect } from 'react';
import { XIcon, InformationCircleIcon } from './Icons';

export const NotificationPermissionBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if Notification API is available and permission is not granted yet
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      setShowBanner(true);
    }
  }, []);

  const handleRequestPermission = () => {
    Notification.requestPermission().then(() => {
      // Hide banner regardless of user's choice
      setShowBanner(false);
    });
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 my-4 flex items-center justify-between">
      <div className="flex items-center">
        <InformationCircleIcon className="w-6 h-6 text-blue-300 mr-3 flex-shrink-0" />
        <p className="text-sm text-blue-200">
          Enable notifications to get an alert when your analysis is complete.
        </p>
      </div>
      <div className="flex items-center ml-4">
        <button
          onClick={handleRequestPermission}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md mr-2 whitespace-nowrap"
        >
          Enable
        </button>
        <button onClick={handleDismiss} className="text-blue-300 hover:text-white">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
