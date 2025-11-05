# TrackFinance - Setup and Development Guide

## Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- Android device with Expo Go app installed (or Android emulator)
- Firebase project (see Firebase Setup below)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/munaimtahir/trackfinance.git
cd trackfinance
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up Firebase configuration (see below)

4. Start the development server:
```bash
npm start
```

5. Scan the QR code with Expo Go app on your Android device

## Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)

2. Enable the following services:
   - **Authentication**: Enable Email/Password provider
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable for bill image uploads
   - **Cloud Messaging** (optional): For push notifications

3. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" and click the web app icon (</>)
   - Copy the configuration values

4. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

5. Fill in your Firebase credentials in `.env`:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Firestore Security Rules

Set up the following Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bills collection
    match /bills/{billId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }
  }
}
```

## Storage Security Rules

Set up the following Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /bills/{userId}/{billId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Creating Test Users

Since this app is designed for two specific users (father and child), you'll need to create accounts manually:

1. Run the app and use the login screen
2. For the first time, you'll need to create users directly in Firebase Console:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter email and password for the father account
   - Repeat for the child account

3. After creating users in Firebase Auth, you can add their profile information to Firestore:
   - Go to Firestore Database
   - Create a document in the `users` collection for each user:
```json
{
  "displayName": "Father",
  "role": "father",
  "email": "father@example.com",
  "deviceTokens": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (requires macOS)
npm run ios

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
trackfinance/
├── app/                    # Application code
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   └── screens/           # Screen components
├── services/              # Firebase service wrappers
│   ├── firebaseApp.ts    # Firebase initialization
│   ├── auth.ts           # Authentication service
│   ├── bills.ts          # Bills CRUD operations
│   ├── storage.ts        # File upload service
│   └── users.ts          # User profile management
├── types/                 # TypeScript type definitions
├── __tests__/            # Test files
│   ├── services/         # Service tests
│   └── hooks/            # Hook tests
├── docs/                  # Documentation
└── .github/              # GitHub configuration
    └── workflows/        # CI/CD workflows
```

## Core Features

### Father Flow
1. Open app and log in
2. Tap "Add Bill" tab
3. Take a photo or select from gallery
4. Enter bill title and optional details
5. Submit to create pending bill

### Child Flow
1. Open app and log in
2. View pending bills in the "Bills" tab
3. Tap a bill to see details
4. Tap "Mark as Paid"
5. Optionally add receipt image and note
6. Confirm to mark bill as paid

## Testing

The app includes comprehensive unit tests for all business logic:

- **Auth Service**: Sign in, sign up, sign out, state management
- **Storage Service**: Image uploads, path generation
- **Bills Service**: Create, read, update, real-time subscriptions
- **Hooks**: Bills management, bill creation, mark as paid

Run tests with:
```bash
npm test
```

## Troubleshooting

### Firebase Connection Issues

If you see Firebase errors:
1. Verify your `.env` file has correct credentials
2. Check that Firebase services are enabled in your project
3. Ensure Firestore and Storage security rules are set up

### Expo Go Connection Issues

If QR code scanning doesn't work:
1. Ensure your computer and phone are on the same network
2. Try using tunnel mode: `npx expo start --tunnel`
3. Check firewall settings

### Build Issues

If `npm install` fails:
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install --legacy-peer-deps` again

## Deployment

For production deployment:

1. Build Android APK:
```bash
eas build --platform android
```

2. Configure EAS Build (if not already done):
```bash
npm install -g eas-cli
eas build:configure
```

3. Follow the Expo EAS Build documentation for detailed deployment instructions

## Contributing

This is a private family app, but contributions are welcome. See `docs/CONTRIBUTING.md` for guidelines.

## License

See LICENSE file for details.
