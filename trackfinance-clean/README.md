# TrackFinance Clean - Expo App

This is the **clean, production-ready** version of the TrackFinance app, created to fix APK crashes and ensure stable Android builds.

## What's Different from the Old App?

### Key Improvements

1. **Simplified Firebase Configuration**
   - Uses simplified Firebase auth initialization (fixes auth crashes)
   - Proper AsyncStorage handling for React Native
   - Clean import paths

2. **Clean Directory Structure**
   ```
   trackfinance-clean/
   ├── src/
   │   ├── config/        # Firebase configuration
   │   ├── services/      # Firebase service layer
   │   ├── contexts/      # React contexts
   │   ├── hooks/         # Custom hooks
   │   ├── screens/       # Screen components
   │   ├── components/    # UI components
   │   ├── navigation/    # React Navigation
   │   └── utils/         # Utilities
   ├── types/             # TypeScript types
   ├── assets/            # Images, icons
   ├── app.config.js      # Expo config with Firebase env vars
   └── App.tsx            # Root component
   ```

3. **Android Permissions**
   - Explicitly declared in `app.config.js`
   - Includes CAMERA, storage permissions

4. **Updated Dependencies**
   - Firebase v12.5.0 (latest stable)
   - Expo SDK 54
   - React Navigation v7

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Firebase project configured

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

### Installation

```bash
npm install
```

### Development

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Type Checking

```bash
npm run type-check
```

### Building

#### Preview Build (APK)
```bash
npm run build:preview
```

#### Production Build (AAB)
```bash
npm run build:production
```

## EAS Configuration

The app is configured with three build profiles in `eas.json`:

- **development**: Development client with APK output
- **preview**: Preview APK for testing (used by CI)
- **production**: Production AAB for Play Store

## GitHub Actions

The CI/CD workflows automatically:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Type checks TypeScript
   - Runs Expo Doctor
   - Checks package versions

2. **EAS Build Workflow** (`.github/workflows/eas-android-apk.yml`)
   - Builds Android APK on push to main or copilot branches
   - Uploads APK as GitHub artifact
   - Uses Firebase config from GitHub Secrets

### Required GitHub Secrets

Set these in your repository settings:

- `EXPO_TOKEN` - Your Expo access token
- `EAS_PROJECT_ID` - EAS project ID (b82ee67c-f187-4dc9-9e07-9103ec5f4344)
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

## Testing

The app has been tested to ensure:

- ✅ TypeScript compiles without errors
- ✅ All imports are correct
- ✅ Firebase initialization works
- ✅ React Navigation is properly configured
- ⏳ Local development server runs (pending manual test)
- ⏳ EAS build succeeds (pending CI run)
- ⏳ APK installs and runs on Android device (pending build)

## Key Fixes from Original App

1. **Auth Persistence**: Simplified Firebase auth initialization instead of complex custom persistence setup
2. **Import Paths**: Updated all imports to use new `/src` structure
3. **Android Permissions**: Added explicit permissions in app config
4. **Build Configuration**: Proper EAS configuration with working directory in CI

## Next Steps

1. ✅ Code migration complete
2. ✅ TypeScript validation passing
3. ✅ CI/CD workflows updated
4. ⏳ Manual testing of local dev
5. ⏳ EAS preview build test
6. ⏳ APK installation and launch test

## Support

For issues or questions, please refer to:
- Main README in repository root
- MIGRATION_NOTES.md for detailed migration documentation
- Original app in repository root (kept for reference)
