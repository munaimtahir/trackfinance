# Cloud Functions for TrackFinance

This directory contains Firebase Cloud Functions for handling push notifications server-side.

## Overview

The Cloud Functions in this directory are **optional** enhancements for production deployments. The app works without them by sending notifications client-side. However, Cloud Functions provide:

- Better reliability (notifications sent even if client app is closed)
- Enhanced security (tokens and logic on server)
- Ability to batch notifications
- More complex notification logic
- Reduced client-side code

## Setup

### Prerequisites

1. Firebase CLI installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Firebase project created (see main [DEPLOYMENT.md](../DEPLOYMENT.md))

### Installation

1. Navigate to the functions directory:
   ```bash
   cd functions
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The functions use Firebase Admin SDK which requires no additional configuration when deployed to Firebase. The SDK automatically uses your Firebase project credentials.

## Deployment

### Option 1: Deploy via Firebase Console

While you can't deploy functions directly from the console, you must use the Firebase CLI.

### Option 2: Deploy via Firebase CLI (Recommended)

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize functions (if not already done):
   ```bash
   cd /path/to/trackfinance
   firebase init functions
   ```
   - Select your Firebase project
   - Choose TypeScript
   - Use existing functions directory

3. Build and deploy:
   ```bash
   cd functions
   npm run build
   cd ..
   firebase deploy --only functions
   ```

4. Verify deployment:
   - Go to Firebase Console → Functions
   - Check that `onBillCreated` and `onBillPaid` are listed

## Functions

### onBillCreated

**Trigger**: Firestore document created in `bills/{billId}`

**Action**: Sends push notification to child user when father creates a new bill

**Payload**:
```javascript
{
  title: "New Bill Added 💰",
  body: "New bill: {bill.title}",
  data: {
    type: "new_bill",
    billId: "{billId}"
  }
}
```

### onBillPaid

**Trigger**: Firestore document updated in `bills/{billId}` where status changes to "paid"

**Action**: Sends push notification to father user when child marks bill as paid

**Payload**:
```javascript
{
  title: "Bill Paid ✅",
  body: "Bill paid: {bill.title}",
  data: {
    type: "bill_paid",
    billId: "{billId}"
  }
}
```

## Testing

### Local Testing with Emulators

1. Start Firebase emulators:
   ```bash
   npm run serve
   ```

2. Configure app to use emulators (in development mode)

3. Test functions by creating/updating bills

### Production Testing

1. Deploy functions:
   ```bash
   npm run deploy
   ```

2. Use production app to create and pay bills

3. Monitor function logs:
   ```bash
   npm run logs
   ```

## Monitoring

### View Logs

```bash
# Recent logs
firebase functions:log

# Tail logs in real-time
firebase functions:log --only onBillCreated

# Filter by function
npm run logs
```

### View in Firebase Console

1. Go to Firebase Console → Functions
2. Click on a function name
3. View "Logs" tab for execution history and errors

## Cost Considerations

Cloud Functions pricing:
- **Free tier**: 2M invocations/month, 400K GB-seconds, 200K CPU-seconds
- **Paid tier**: $0.40 per million invocations beyond free tier

For typical family use (2-3 bills/day):
- ~180 bills/month
- ~360 function invocations (2 per bill - create + paid)
- **Well within free tier**

See [Firebase Pricing](https://firebase.google.com/pricing) for details.

## Alternative: Client-Side Notifications

Currently, the app sends notifications directly from the client using the Expo Push API. This works for the MVP but has limitations:

**Pros**:
- Simple implementation
- No server setup required
- No additional costs

**Cons**:
- Requires internet connectivity on the client
- Can fail if the app is closed
- Less secure (tokens are exposed to client)
- Cannot batch notifications

**Recommendation**: Use client-side for development/testing, switch to Cloud Functions for production.

## Troubleshooting

### Function Not Deploying

- Verify Firebase CLI is logged in: `firebase login`
- Check project is selected: `firebase use --add`
- Build TypeScript: `npm run build`
- Check for errors in build output

### Notifications Not Sending

- Check function logs for errors: `npm run logs`
- Verify Expo Push tokens are valid
- Check that `deviceTokens` array exists in user documents
- Test with Expo push notification tool

### Permission Errors

- Ensure Firebase Admin SDK is initialized
- Verify function has access to Firestore
- Check IAM permissions in Google Cloud Console

## Migration from Client-Side

To migrate from client-side to server-side notifications:

1. Deploy Cloud Functions (this directory)
2. Remove notification logic from client code in `services/notifications.ts`
3. Keep device token registration in client
4. Test thoroughly with production build

Note: You can run both client-side and server-side notifications temporarily during migration.

## Support

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Cloud Functions Samples](https://github.com/firebase/functions-samples)

