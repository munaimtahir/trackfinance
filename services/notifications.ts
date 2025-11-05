/**
 * Notifications Service
 * Handles push notification token registration and sending notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { saveDeviceToken, getUserProfile } from './users';
import { getBill } from './bills';

/**
 * Configure notification handler for foreground notifications
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and save the token
 */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices');
    return null;
  }

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push notification permissions');
    return null;
  }

  // Get the Expo push token
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error('EXPO_PUBLIC_FIREBASE_PROJECT_ID is not configured');
    return null;
  }
  
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  const token = tokenData.data;

  // Save token to user profile in Firestore
  await saveDeviceToken(userId, token);

  // Configure Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

/**
 * Send a notification to specific device tokens
 * Note: In production, this should be called from a backend/Cloud Function
 * For now, this prepares the notification payload
 */
export interface NotificationPayload {
  to: string[]; // Array of Expo push tokens
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Prepare notification payload for new bill creation
 */
export async function prepareNewBillNotification(
  billId: string,
  childUserId: string
): Promise<NotificationPayload | null> {
  try {
    // Get the bill details
    const bill = await getBill(billId);
    if (!bill) {
      return null;
    }

    // Get child's device tokens
    const childProfile = await getUserProfile(childUserId);
    if (!childProfile || childProfile.deviceTokens.length === 0) {
      return null;
    }

    return {
      to: childProfile.deviceTokens,
      title: 'New Bill Added 💰',
      body: `New bill: ${bill.title}`,
      data: {
        type: 'new_bill',
        billId,
      },
    };
  } catch (error) {
    console.error('Error preparing new bill notification:', error);
    return null;
  }
}

/**
 * Prepare notification payload for bill marked as paid
 */
export async function prepareBillPaidNotification(
  billId: string,
  fatherUserId: string
): Promise<NotificationPayload | null> {
  try {
    // Get the bill details
    const bill = await getBill(billId);
    if (!bill) {
      return null;
    }

    // Get father's device tokens
    const fatherProfile = await getUserProfile(fatherUserId);
    if (!fatherProfile || fatherProfile.deviceTokens.length === 0) {
      return null;
    }

    return {
      to: fatherProfile.deviceTokens,
      title: 'Bill Paid ✅',
      body: `Bill paid: ${bill.title}`,
      data: {
        type: 'bill_paid',
        billId,
      },
    };
  } catch (error) {
    console.error('Error preparing bill paid notification:', error);
    return null;
  }
}

/**
 * Expo Push API endpoint
 */
const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Send push notification via Expo Push API
 * This is a helper function - in production, call this from a secure backend
 */
export async function sendPushNotification(
  payload: NotificationPayload
): Promise<void> {
  const messages = payload.to.map((token) => ({
    to: token,
    sound: 'default',
    title: payload.title,
    body: payload.body,
    data: payload.data,
  }));

  try {
    const response = await fetch(EXPO_PUSH_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    
    // Check for errors
    if (result.errors) {
      console.error('Push notification errors:', result.errors);
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
    throw error;
  }
}

/**
 * Handle notification received (for in-app handling)
 */
export function addNotificationReceivedListener(
  handler: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(handler);
}

/**
 * Handle notification response (user taps notification)
 */
export function addNotificationResponseReceivedListener(
  handler: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}
