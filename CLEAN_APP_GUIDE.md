# TrackFinance Clean App - Quick Start Guide

## 🎯 What This Is

This repository now contains **two versions** of the TrackFinance app:

1. **Original App** (root directory) - Historical reference, kept for comparison
2. **Clean App** (`trackfinance-clean/`) - ✅ **THIS IS THE NEW PRIMARY APP**

## 🚀 Why the Clean App?

The original app was experiencing APK crashes. We've created a fresh Expo project with:

- ✅ **Simplified Firebase initialization** (fixes auth crashes)
- ✅ **Clean directory structure** (`/src` folder organization)
- ✅ **Explicit Android permissions**
- ✅ **Updated CI/CD workflows**
- ✅ **Latest stable dependencies**

**All features from the original app have been migrated.**

## 📁 Project Structure

```
trackfinance/
├── trackfinance-clean/        ← ✅ USE THIS - New clean app
│   ├── src/
│   │   ├── config/           # Firebase setup
│   │   ├── services/         # Firebase services
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── screens/          # App screens
│   │   ├── components/       # UI components
│   │   ├── navigation/       # Navigation setup
│   │   └── utils/            # Utilities
│   ├── types/                # TypeScript types
│   ├── assets/               # Images and icons
│   ├── app.config.js         # Expo configuration
│   ├── eas.json              # EAS build config
│   ├── package.json          # Dependencies
│   └── README.md             # Clean app README
│
├── [old app files]           ← Keep for reference only
├── MIGRATION_NOTES.md        ← Detailed migration documentation
├── CLEAN_APP_GUIDE.md        ← This file
└── .github/workflows/        ← Updated to build from trackfinance-clean/
```

## 🏃 Quick Start (Clean App)

### 1. Navigate to Clean App

```bash
cd trackfinance-clean
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Then edit .env with your Firebase credentials
```

### 4. Start Development Server

```bash
npm start
```

### 5. Build APK (via EAS)

```bash
# Preview build (APK for testing)
npm run build:preview

# Production build (AAB for Play Store)
npm run build:production
```

## 🔧 Key Differences from Original App

### Firebase Configuration

**Before (Original App)**:
```typescript
// Complex custom initialization with manual persistence
initializeAuth(app, {
  persistence: indexedDBLocalPersistence  // ❌ Caused crashes
});
```

**After (Clean App)**:
```typescript
// Simplified standard initialization
const auth = getAuth(app);  // ✅ AsyncStorage handled automatically
```

### Directory Structure

**Before**: Flat structure with `app/`, `services/`, etc. at root  
**After**: Organized `/src` structure with clear separation

### Import Paths

**Before**: `import { auth } from '../../services/firebaseApp'`  
**After**: `import { auth } from '../config/firebase'`

### Android Permissions

**Before**: Not explicitly declared  
**After**: Declared in `app.config.js` (CAMERA, storage, etc.)

## 🤖 CI/CD Changes

GitHub Actions workflows now build from `trackfinance-clean/`:

- `.github/workflows/eas-android-apk.yml` - Builds Android APK
- `.github/workflows/ci.yml` - Runs type checks and validation

All workflows use `working-directory: trackfinance-clean`.

## ✅ Validation Status

- [x] TypeScript compiles without errors
- [x] All imports resolved
- [x] EAS configuration valid
- [ ] Local development server tested
- [ ] EAS build succeeds
- [ ] APK installs on Android device
- [ ] App launches without crashes

## 📚 Documentation

- **`trackfinance-clean/README.md`** - Clean app documentation
- **`MIGRATION_NOTES.md`** - Detailed technical migration notes
- **Original README.md** - Still valid for app features and Firebase setup

## 🎓 For Developers

### Working with the Clean App

1. **All development** should happen in `trackfinance-clean/`
2. **Do not modify** the old app files (kept for reference only)
3. **Use the new import paths** (`src/config/firebase`, `src/services/*`, etc.)
4. **TypeScript check** before committing: `npm run type-check`

### Adding Features

```bash
cd trackfinance-clean

# Add a new screen
touch src/screens/NewScreen.tsx

# Add a new service function
# Edit: src/services/[service-name].ts

# Add a new component
touch src/components/NewComponent.tsx
```

### Testing Locally

```bash
cd trackfinance-clean
npm start

# Or run on device/emulator
npm run android
npm run ios  # if on macOS
```

### Building for Release

```bash
cd trackfinance-clean

# Preview build (APK)
npm run build:preview

# Production build (AAB for Play Store)
npm run build:production
```

## 🔐 Environment Variables

Required in `.env` file (local) and GitHub Secrets (CI):

```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
```

For CI, also need:
```
EXPO_TOKEN
EAS_PROJECT_ID
```

## 🐛 Troubleshooting

### "Cannot find module" errors
- Make sure you're in `trackfinance-clean/` directory
- Run `npm install`
- Check import paths use new structure

### Firebase not initializing
- Check `.env` file exists and has correct values
- Verify Firebase project settings in Firebase Console
- Check `app.config.js` reads env vars correctly

### EAS build fails
- Verify GitHub Secrets are set correctly
- Check `eas.json` configuration
- Ensure EAS project is linked: `npx eas project:info`

### TypeScript errors
- Run `npm run type-check` to see all errors
- Verify all imports use correct paths
- Check types are properly imported from `../../types`

## 🎯 Next Steps

1. **Test Locally**: Run `npm start` in `trackfinance-clean/`
2. **Build on EAS**: Push to trigger GitHub Actions
3. **Install APK**: Download from Actions artifacts
4. **Verify**: Launch app on Android device
5. **Celebrate**: If it works, the migration is complete! 🎉

## 📞 Need Help?

- Check **MIGRATION_NOTES.md** for technical details
- Review **trackfinance-clean/README.md** for app-specific docs
- Check GitHub Actions logs for build errors
- Review Firebase Console for backend issues

---

**Remember**: Always work in `trackfinance-clean/` directory going forward. The old app files are kept for reference only and will be archived once the clean app is fully validated.
