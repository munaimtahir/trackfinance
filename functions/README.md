# Cloud Functions for TrackFinance

This directory contains Firebase Cloud Functions for handling push notifications.

## Setup

To deploy these functions:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize functions (if not already done):
   ```bash
   firebase init functions
   ```

4. Deploy:
   ```bash
   firebase deploy --only functions
   ```

## Functions

### onBillCreated

Triggers when a new bill is created in Firestore. Sends a push notification to the child user.

### onBillPaid

Triggers when a bill status changes to "paid". Sends a push notification to the father user.

## Alternative: Client-Side Notifications

Currently, the app sends notifications directly from the client using the Expo Push API. This works for the MVP but has limitations:

- Requires internet connectivity on the client
- Can fail if the app is closed
- Less secure (tokens are exposed to client)

For production, consider moving notification logic to Cloud Functions for:
- Better reliability
- Enhanced security
- Ability to batch notifications
- More complex notification logic
