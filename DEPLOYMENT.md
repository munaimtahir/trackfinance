# Deployment Guide

This guide covers deploying TrackFinance to production with Firebase and Expo.

## Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Deploy Firebase Rules](#deploy-firebase-rules)
3. [Deploy Cloud Functions (Optional)](#deploy-cloud-functions-optional)
4. [Build Android App](#build-android-app)
5. [Production Checklist](#production-checklist)

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `trackfinance-prod` (or your choice)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services

#### Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click "Save"

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Select location (choose closest to your users)
4. Start in **production mode** (we'll deploy rules next)
5. Click "Enable"

#### Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in **production mode** (we'll deploy rules next)
4. Click "Done"

#### Cloud Messaging
1. Go to **Project Settings** → **Cloud Messaging**
2. Note your **Sender ID** (already enabled by default)

### 3. Get Firebase Configuration

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps"
3. Click "Add app" → Select **Web** (</>) icon
4. Register app with nickname: "TrackFinance Web"
5. Copy the configuration values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

6. Create `.env` file in project root with these values:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Deploy Firebase Rules

### Option 1: Firebase Console (Easy)

#### Firestore Rules
1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents of `firestore.rules` from this repository
3. Paste into the editor
4. Click **Publish**

#### Storage Rules
1. Go to **Storage** → **Rules** tab
2. Copy the contents of `storage.rules` from this repository
3. Paste into the editor
4. Click **Publish**

### Option 2: Firebase CLI (Recommended for Teams)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project directory:
```bash
firebase init
```
   - Select: Firestore, Storage, Functions (optional)
   - Select your Firebase project
   - Use default options for Firestore and Storage rules files

4. The rules files are already in the repository. Deploy them:
```bash
firebase deploy --only firestore:rules,storage
```

## Deploy Cloud Functions (Optional)

Cloud Functions provide server-side notification handling for better reliability and security.

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Deploy Functions

```bash
firebase deploy --only functions
```

This deploys:
- `onBillCreated`: Sends push notification when father creates a bill
- `onBillPaid`: Sends push notification when child marks bill as paid

### 3. Verify Deployment

Check Firebase Console → **Functions** to see deployed functions.

**Note**: The app works without Cloud Functions. It sends notifications client-side by default. Cloud Functions are recommended for production but optional.

## Build Android App

### Development Build (Testing)

1. **Install EAS CLI**:
```bash
npm install -g eas-cli
```

2. **Login to Expo**:
```bash
eas login
```

3. **Configure EAS**:
```bash
eas build:configure
```

4. **Create Development Build**:
```bash
eas build --profile development --platform android
```

5. **Install on Device**:
   - Download the APK from the EAS build page
   - Install on your Android device
   - Test all features with two devices (father and child)

### Production Build

1. **Update app.json**:
   - Set correct `version` (e.g., "1.0.0")
   - Set correct `android.versionCode` (e.g., 1)
   - Configure `android.package` (e.g., "com.yourname.trackfinance")

2. **Create Production Build**:
```bash
eas build --profile production --platform android
```

3. **Download APK**:
   - Get the APK from EAS build page
   - Or submit to Google Play Store

### Submit to Google Play Store

```bash
eas submit --platform android
```

Follow the prompts to submit your app.

## Production Checklist

Before deploying to production, verify:

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] Lint checks passing: `npm run lint`
- [ ] Type checks passing: `npm run type-check`
- [ ] No console.log or debug statements in production code

### Firebase Configuration
- [ ] Firebase project created (production)
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created in production mode
- [ ] Firestore rules deployed and tested
- [ ] Storage enabled with production rules deployed
- [ ] Cloud Messaging enabled
- [ ] Environment variables set correctly (`.env` file)

### Security
- [ ] Firestore rules prevent unauthorized access
- [ ] Storage rules protect user images
- [ ] `.env` file NOT committed to Git
- [ ] Firebase API keys rotated if accidentally exposed

### Testing
- [ ] Test user registration flow (father and child)
- [ ] Test bill creation with image upload
- [ ] Test bill payment with optional receipt
- [ ] Test push notifications on two devices
- [ ] Test real-time sync across devices
- [ ] Test offline behavior and error handling

### Documentation
- [ ] README updated with setup instructions
- [ ] CHANGELOG updated with version history
- [ ] Firebase rules documented
- [ ] Deployment guide reviewed

### App Build
- [ ] Version number updated in `app.json`
- [ ] Package name configured correctly
- [ ] App icon and splash screen configured
- [ ] Production build created and tested
- [ ] APK signed (for direct distribution) or submitted to Play Store

### Post-Deployment
- [ ] Monitor Firebase Console for errors
- [ ] Check Firestore usage and costs
- [ ] Monitor Storage usage
- [ ] Set up budget alerts in Firebase
- [ ] Create backup strategy for Firestore data

## Monitoring and Maintenance

### Firebase Console Monitoring
- **Authentication**: Monitor active users
- **Firestore**: Monitor reads/writes, database size
- **Storage**: Monitor storage usage
- **Functions**: Monitor invocations and errors (if using Cloud Functions)

### Setting Budget Alerts
1. Go to Firebase Console → **Usage and billing**
2. Set up budget alerts to prevent unexpected costs
3. Recommended limits:
   - Firestore: 50K reads/day (adjust based on usage)
   - Storage: 1GB (adjust based on usage)

### Backup Strategy
1. Export Firestore data regularly:
```bash
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

2. Set up automated backups using Cloud Scheduler (optional)

## Troubleshooting

### Build Issues
- Clear Expo cache: `npx expo start -c`
- Clear EAS build cache: `eas build --clear-cache`
- Check `app.json` for correct SDK version

### Firebase Rules Issues
- Test rules in Firebase Console → Rules → Playground
- Check Firestore/Storage logs for denied requests
- Verify user authentication is working

### Notification Issues
- Verify FCM is enabled in Firebase Console
- Check device tokens are saved in Firestore users collection
- Test with development build (Expo Go has limitations)
- Check Expo push notification documentation

## Support

For issues:
1. Check [Setup.md](./Setup.md) for development setup
2. Review [docs/](./docs/) for detailed documentation
3. Check Firebase Console for error logs
4. Check GitHub Issues for known problems
