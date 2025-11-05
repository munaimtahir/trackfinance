# Setup Guide (Developer)

1. Install Node.js (LTS) and npm or pnpm.
2. Install Expo CLI: `npm install -g expo-cli` (or `npx expo`).
3. Clone this repository.
4. Create a Firebase project and enable:
   - Authentication (Email/Password or Phone)
   - Firestore
   - Storage
   - Cloud Messaging
5. Configure Firebase:
   - Copy `.env.example` to `.env` in the root directory
   - Get your Firebase config from: Firebase Console → Project Settings → General
   - Replace placeholder values in `.env` with your actual Firebase credentials
   - **Never commit the `.env` file** (it's already in `.gitignore`)
6. Install dependencies:
   - `npm install` or `pnpm install`
7. Run the app:
   - `npx expo start`
   - Scan QR code with Expo Go on Android.
