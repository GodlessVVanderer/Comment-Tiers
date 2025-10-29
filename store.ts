import { create } from 'zustand';

type NotificationPermission = 'default' | 'denied' | 'granted';

interface AppState {
  notificationPermission: NotificationPermission;
  checkNotificationPermission: () => void;
}

// A simple Zustand store to manage global app state, like notification permissions.
export const useAppStore = create<AppState>((set) => ({
  notificationPermission: 'default',
  checkNotificationPermission: () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      set({ notificationPermission: Notification.permission });
    }
  },
}));

// Initialize permission status on load
if (typeof window !== 'undefined') {
    useAppStore.getState().checkNotificationPermission();
}
