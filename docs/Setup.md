# Setup Guide (Developer)

1. Install Node.js (LTS) and npm or pnpm.
2. Install Expo CLI: `npm install -g expo-cli` (or `npx expo`).
3. Clone this repository.
4. Create a Firebase project and enable:
   - Authentication
   - Firestore
   - Storage
   - Cloud Messaging
5. Copy Firebase config into a local `.env` or `app.config.ts` (implementation detail up to AI dev).
6. Install dependencies:
   - `npm install` or `pnpm install` (after the AI dev scaffolds the app).
7. Run the app:
   - `npx expo start`
   - Scan QR code with Expo Go on Android.
