/**
 * Cloud Functions for TrackFinance
 * 
 * This is example/reference code for Cloud Functions that could be deployed
 * to handle push notifications server-side for better reliability and security.
 * 
 * To use this:
 * 1. Set up a Firebase Functions project
 * 2. Install dependencies: npm install firebase-functions firebase-admin
 * 3. Deploy: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Trigger when a new bill is created
 * Sends push notification to child user
 */
export const onBillCreated = functions.firestore
  .document('bills/{billId}')
  .onCreate(async (snap, context) => {
    const bill = snap.data();
    const billId = context.params.billId;

    // Get child user (assuming we store assignedTo or lookup by role)
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('role', '==', 'child')
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('No child user found');
      return;
    }

    const childUser = usersSnapshot.docs[0].data();
    const deviceTokens = childUser.deviceTokens || [];

    if (deviceTokens.length === 0) {
      console.log('No device tokens for child user');
      return;
    }

    // Prepare push notification messages
    const messages = deviceTokens.map((token: string) => ({
      to: token,
      sound: 'default',
      title: 'New Bill Added 💰',
      body: `New bill: ${bill.title}`,
      data: {
        type: 'new_bill',
        billId,
      },
    }));

    // Send via Expo Push API
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  });

/**
 * Trigger when a bill status changes to paid
 * Sends push notification to father user
 */
export const onBillPaid = functions.firestore
  .document('bills/{billId}')
  .onUpdate(async (change, context) => {
    const billBefore = change.before.data();
    const billAfter = change.after.data();
    const billId = context.params.billId;

    // Only trigger if status changed to paid
    if (billBefore.status !== 'paid' && billAfter.status === 'paid') {
      // Get father user
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('role', '==', 'father')
        .limit(1)
        .get();

      if (usersSnapshot.empty) {
        console.log('No father user found');
        return;
      }

      const fatherUser = usersSnapshot.docs[0].data();
      const deviceTokens = fatherUser.deviceTokens || [];

      if (deviceTokens.length === 0) {
        console.log('No device tokens for father user');
        return;
      }

      // Prepare push notification messages
      const messages = deviceTokens.map((token: string) => ({
        to: token,
        sound: 'default',
        title: 'Bill Paid ✅',
        body: `Bill paid: ${billAfter.title}`,
        data: {
          type: 'bill_paid',
          billId,
        },
      }));

      // Send via Expo Push API
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messages),
        });

        const result = await response.json();
        console.log('Notification sent:', result);
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  });
