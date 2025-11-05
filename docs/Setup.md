# Setup Guide (Developer)

## Prerequisites

1. Install Node.js (LTS) and npm or pnpm.
2. Install Expo CLI: `npm install -g expo-cli` (or use `npx expo`).
3. Clone this repository.

## Firebase Project Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable the following services:

   ### Authentication
   - Go to Authentication → Sign-in method
   - Enable **Email/Password** authentication
   - This allows father and child to sign in with email and password

   ### Firestore Database
   - Go to Firestore Database
   - Create database (start in test mode for development)
   - The app will automatically create collections: `users` and `bills`

   ### Storage
   - Go to Storage
   - Get started with default rules (secure rules for development)
   - This stores bill images and receipt images

   ### Cloud Messaging (FCM)
   - FCM is automatically enabled for push notifications
   - Device tokens will be stored in the `users` collection (notifications implemented in later phase)

3. Get your Firebase configuration:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - If no app exists, click "Add app" and select Web
   - Copy the configuration values (apiKey, authDomain, etc.)

## Configure Environment Variables

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace placeholder values with your Firebase credentials:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Important**: Never commit the `.env` file (it's already in `.gitignore`)

## Install Dependencies

```bash
npm install
# or
pnpm install
```

## Run the App

```bash
npx expo start
```

Then:
- Scan QR code with Expo Go on Android device
- Press `a` to open in Android emulator (if installed)
- Press `i` to open in iOS simulator (macOS only)

## First Time User Setup

1. **Create test accounts**:
   - Sign up with two different email addresses (one for father, one for child)
   - You can use Firebase Console → Authentication to create test users manually

2. **On first login**:
   - Each user will see a profile setup screen
   - Enter your name
   - Select role: Father or Child
   - Click Continue

3. **Father workflow**:
   - "Add Bill" tab: Create bills with photos
   - "Bills" tab: View pending and paid bills

4. **Child workflow**:
   - "Add Bill" tab: Shows message (only father can add bills)
   - "Bills" tab: View bills and mark as paid with receipt

## Testing

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

Type check:
```bash
npm run type-check
```

## Troubleshooting

- **Firebase errors**: Verify all configuration values in `.env` are correct
- **Build errors**: Clear cache with `npx expo start -c`
- **Test failures**: Run `npm test` to see detailed error messages
