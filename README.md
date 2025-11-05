# TrackFinance - Family Bill Tracker

A private Android-first mobile app for two users (father and child) to track household bills without using WhatsApp threads.

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

- [Setup Guide](docs/Setup.md) - Complete setup instructions
- [Architecture](docs/Architecture.md) - App structure and design
- [Data Model](docs/DataModel.md) - Database schema
- [QA Checklist](docs/QA-Checklist.md) - Feature verification
- [Testing](docs/Tests.md) - Testing guidelines

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

## License

This project is private and for personal use.
