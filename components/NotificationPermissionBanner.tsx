import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { BellIcon, CloseIcon } from './Icons';

export const NotificationPermissionBanner: React.FC = () => {
  const { notificationPermission, checkNotificationPermission } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner only if permission is not yet granted or denied.
    if (notificationPermission === 'default') {
      // Small delay to not be too intrusive on load
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notificationPermission]);

  const handleRequestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        // Hide the banner regardless of choice, and re-check the status to update the store.
        setIsVisible(false);
        checkNotificationPermission();
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // You might want to set a flag in localStorage here to not show it again for this session/day
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-indigo-900/50 border border-indigo-700 text-indigo-200 px-4 py-3 rounded-lg flex items-center justify-between gap-3 mb-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <BellIcon className="w-6 h-6 flex-shrink-0" />
        <span className="text-sm">Get notified when analysis is complete?</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleRequestPermission}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors"
        >
          Enable
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-indigo-700/50 transition-colors"
          aria-label="Dismiss"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
