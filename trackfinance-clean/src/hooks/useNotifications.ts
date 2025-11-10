/**
 * Notifications Hook
 * Custom React hook for managing push notifications
 */

import { useEffect } from 'react';
import type * as Notifications from 'expo-notifications';
import { useAuth } from '../contexts/AuthContext';
import {
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from '../services/notifications';

/**
 * Hook to register for push notifications
 */
export function useNotificationRegistration() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    // Register for push notifications
    registerForPushNotifications(user.uid).catch((error) => {
      console.error('Failed to register for push notifications:', error);
    });
  }, [user]);
}

/**
 * Hook to handle notification interactions
 */
export function useNotificationHandlers(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) {
  useEffect(() => {
    // Handle notification received while app is in foreground
    const receivedSubscription = onNotificationReceived
      ? addNotificationReceivedListener(onNotificationReceived)
      : null;

    // Handle notification tapped by user
    const responseSubscription = onNotificationTapped
      ? addNotificationResponseReceivedListener(onNotificationTapped)
      : null;

    return () => {
      receivedSubscription?.remove();
      responseSubscription?.remove();
    };
  }, [onNotificationReceived, onNotificationTapped]);
}

/**
 * Combined hook for notification setup
 */
export function useNotifications(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) {
  useNotificationRegistration();
  useNotificationHandlers(onNotificationReceived, onNotificationTapped);
}
