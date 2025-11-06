# Quick Start Guide

Get TrackFinance up and running in 5 minutes!

## Prerequisites

- **Node.js** (LTS version): [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **Android Device** with Expo Go app installed: [Get Expo Go](https://expo.dev/client)
- **Firebase Account**: [Sign up](https://firebase.google.com/)

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/munaimtahir/trackfinance.git
cd trackfinance

# Install dependencies
npm install
```

## Step 2: Firebase Setup (3 minutes)

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter name: `trackfinance-dev`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Services

1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Click "Save"

2. **Firestore**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in "test mode" (for development)
   - Select location closest to you
   - Click "Enable"

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in "test mode" (for development)
   - Click "Done"

### Get Configuration

1. Go to Project Settings (gear icon) → General
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Register app: "TrackFinance Web"
5. Copy the config values

### Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Firebase config:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## Step 3: Run the App (1 minute)

```bash
# Start Expo development server
npm start
```

You'll see a QR code in your terminal.

**On your Android device**:
1. Open Expo Go app
2. Scan the QR code
3. App will load on your device!

## Step 4: Create Test Accounts

### First Account (Father)

1. Tap "Don't have an account? Sign Up"
2. Email: `father@test.com`
3. Password: `Test123!`
4. Tap "Sign Up"
5. Enter name: "Dad"
6. Select role: "Father"
7. Tap "Continue"

### Second Account (Child)

For testing, you need a second device or use Firebase Console to create the account:

**Option A: Second Device**
1. Install Expo Go on second device
2. Scan same QR code
3. Sign up with different email

**Option B: Firebase Console**
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Email: `child@test.com`
4. Password: `Test123!`
5. Then login with these credentials in app

## Step 5: Test the App

### As Father (Device 1)

1. Tap "Add Bill" tab
2. Tap "Take Photo" (or "Choose from Gallery")
3. Take/select a photo
4. Enter title: "Test Bill"
5. Tap "Create Bill"
6. ✅ Bill appears in Bills tab

### As Child (Device 2)

1. Tap "Bills" tab
2. See the bill from father
3. Tap on the bill
4. Tap "Mark as Paid"
5. Tap "Confirm Payment"
6. ✅ Bill moves to Paid tab

### Verify Real-Time Sync

- Create bill on Device 1
- Within 2 seconds, it appears on Device 2
- Mark as paid on Device 2
- Within 2 seconds, status updates on Device 1

## Troubleshooting

### App won't load?

```bash
# Clear cache and restart
npx expo start -c
```

### Firebase errors?

- Double-check `.env` file has correct values
- Verify services are enabled in Firebase Console
- Check you're using "test mode" for Firestore/Storage

### Can't install dependencies?

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### QR code not scanning?

- Make sure phone and computer are on same WiFi
- Try tunnel mode: `npx expo start --tunnel`

## Next Steps

Now that you have the app running:

1. **Explore**: Try all features (create bills, mark as paid, add receipts)
2. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. **Customize**: Modify code to fit your needs
4. **Secure**: Deploy Firebase rules from `firestore.rules` and `storage.rules`

## Development Commands

```bash
# Start development server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check

# Health check
npm run doctor
```

## What's Next?

### For Development

- **Documentation**: Read [docs/Setup.md](docs/Setup.md) for detailed setup
- **Architecture**: Understand the app in [docs/Architecture.md](docs/Architecture.md)
- **Testing**: Run comprehensive tests using [TESTING_GUIDE.md](TESTING_GUIDE.md)

### For Production

- **Security**: Deploy Firebase rules from `firestore.rules` and `storage.rules`
- **Build**: Create production Android app with EAS
- **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md)
- **Monitor**: Set up Firebase monitoring and alerts

## Support

- **Issues**: [GitHub Issues](https://github.com/munaimtahir/trackfinance/issues)
- **Documentation**: See `docs/` directory
- **Firebase Help**: [Firebase Documentation](https://firebase.google.com/docs)
- **Expo Help**: [Expo Documentation](https://docs.expo.dev/)

## License

CC0 1.0 Universal - Public Domain. See [LICENSE](LICENSE).

---

**Happy coding! 🚀**

If you get stuck, check the [Setup Guide](docs/Setup.md) for more detailed instructions.
