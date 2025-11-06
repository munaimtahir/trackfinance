# TrackFinance - Family Bill Tracker

A production-ready Android-first mobile app for two users (father and child) to track household bills without using WhatsApp threads.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](#testing)

## Features

### Core Functionality
- 📸 **Bill Capture**: Father takes photos of bills and uploads them with details
- 📝 **Bill Management**: View bills organized by status (Pending/Paid)
- ✅ **Mark as Paid**: Child marks bills as paid with optional receipt and notes
- 🔔 **Push Notifications**: Automatic notifications for new bills and payments
- 🔐 **Firebase Auth**: Secure email/password authentication
- 👥 **Role-Based Access**: Different capabilities for father and child roles
- 🔄 **Real-time Sync**: Bills update instantly across all devices

## Core Idea

- Your father takes a **photo of each new bill** inside the app
- The bill is uploaded to Firebase Storage and stored as **Pending** in Firestore
- You get a **push notification** and see all **Pending** bills in a list
- After you pay a bill, you:
  - Mark it as **Paid**
  - Optionally add a **payment screenshot** and a short note
  - Father receives a **push notification** that the bill was paid
- Both of you can always see which bills are **Pending vs Paid**

## Tech Stack

- **Mobile App**: React Native + Expo (Android-first, iOS-friendly)
- **Language**: TypeScript
- **Backend**: Firebase
  - Firestore (database)
  - Storage (images)
  - Authentication
  - Cloud Messaging (push notifications)
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions (lint + tests + build)

## Quick Start

### Prerequisites
- Node.js (LTS version)
- npm or pnpm
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/munaimtahir/trackfinance.git
   cd trackfinance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase (see [docs/Setup.md](docs/Setup.md) for detailed instructions):
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Copy Firebase config to `.env` file

4. Run the app:
   ```bash
   npm start
   ```
   Then scan the QR code with Expo Go on your Android device.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linter
npm run lint

# Type check
npm run type-check
```

## Android Build & Health Checks

Before committing code, ensure all checks pass:

```bash
# Full validation suite
npm run type-check  # TypeScript validation
npm run lint        # Code style and quality
npm test            # Unit and integration tests
npm run doctor      # Expo project health check
npm run android:check  # Package version compatibility
```

### Common Issues and Fixes

**Package version mismatches**: If `npm run doctor` reports version issues, run:
```bash
npx expo install --fix
```

**Build errors**: Clear Metro bundler cache:
```bash
npx expo start -c
```

**Test failures**: Check the error messages and ensure Firebase mocks are properly configured in `jest.setup.js`

## Project Structure

```
trackfinance/
├── app/                    # React Native app code
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation setup
│   ├── screens/           # Screen components
│   └── utils/             # Utility functions
├── services/              # Firebase and business logic
│   ├── auth.ts           # Authentication service
│   ├── bills.ts          # Bills management
│   ├── storage.ts        # File uploads
│   ├── users.ts          # User profiles
│   ├── notifications.ts   # Push notifications
│   └── notificationHelpers.ts
├── functions/             # Cloud Functions (optional)
├── __tests__/             # Test files
├── docs/                  # Documentation
│   ├── Architecture.md
│   ├── DataModel.md
│   ├── Goals.md
│   ├── QA-Checklist.md
│   ├── Setup.md
│   └── Tests.md
└── types/                 # TypeScript type definitions
```

## Documentation

### Getting Started
- [Setup Guide](docs/Setup.md) - Complete development setup instructions
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [Security Documentation](SECURITY.md) - Security implementation and best practices

### Technical Documentation
- [Architecture](docs/Architecture.md) - App structure and design
- [Data Model](docs/DataModel.md) - Database schema
- [Testing](docs/Tests.md) - Testing guidelines
- [QA Checklist](docs/QA-Checklist.md) - Feature verification

### Reference Files
- [CHANGELOG](CHANGELOG.md) - Version history
- [Firebase Rules](firestore.rules) - Firestore security rules
- [Storage Rules](storage.rules) - Firebase Storage security rules

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick deployment checklist:
1. Create Firebase project and enable services
2. Deploy Firestore and Storage security rules
3. Configure environment variables
4. Build Android app with EAS
5. Test thoroughly with two devices

See the full deployment guide for detailed instructions.

## Workflows

### Father Workflow
1. Log in with email/password
2. Navigate to "Add Bill" tab
3. Capture/select bill photo
4. Enter title (required), description, and amount (optional)
5. Submit → Child receives push notification
6. View bills in "Bills" tab (Pending/Paid)

### Child Workflow
1. Log in with email/password
2. Receive notification when new bill is added
3. Navigate to "Bills" tab
4. Tap on a pending bill to view details
5. Tap "Mark as Paid"
6. Optionally add receipt image and payment note
7. Confirm → Father receives push notification
8. Bill moves to "Paid" tab

## Contributing

This repository is structured as an **AI-friendly dev pack**. An AI developer agent can read the docs in `docs/` and implement features following the established patterns.

### For Developers
- Follow the existing code structure and patterns
- Run `npm run lint` and `npm run type-check` before committing
- Ensure all tests pass with `npm test`
- Update documentation when adding new features

## Security

TrackFinance implements multiple security layers:
- Firebase Authentication for user management
- Firestore security rules to protect user data
- Storage rules to secure bill images
- Role-based access control
- Environment variable configuration

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## License

This project is released under CC0 1.0 Universal (Public Domain). See [LICENSE](LICENSE) for details.

## Version History

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

Current version: **1.0.0**
