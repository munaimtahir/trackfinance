# Architecture

## Overview

- **Client:** React Native app using **Expo**, Android-first.
- **Backend:** Firebase
  - Authentication (Firebase Auth)
  - Database (Cloud Firestore)
  - File storage (Firebase Storage)
  - Notifications (Firebase Cloud Messaging)

The app is a thin client over Firebase, with most persistent state in Firestore.

## Layers

1. **Presentation (UI)**
   - Screens:
     - `LoginScreen`
     - `HomeScreen` (father entry point)
     - `BillsTabsScreen` (Pending / Paid)
     - `BillDetailScreen`
     - `SettingsScreen` (optional/minimal)
   - Components:
     - `BillCard`
     - `BillStatusBadge`
     - `PrimaryButton`, `SecondaryButton`
     - Simple layout wrappers.

2. **Navigation**
   - React Navigation stack:
     - Auth stack
     - Main app stack with tabs:
       - Bills (Pending/Paid)
       - Profile/Settings

3. **State and Data Access**
   - Hooks:
     - `useCurrentUser`
     - `useBills({ status })`
     - `useBill(id)`
   - Actions:
     - `useCreateBill`
     - `useMarkBillPaid`
   - These hooks call a `services/firebase` layer with Firestore/Storage SDKs.

4. **Notifications**
   - Use Expo Notifications with FCM integration.
   - Store device tokens in `users` collection.
   - On new bill / bill paid:
     - Call a Cloud Function or serverless endpoint to send push notification.

5. **Configuration**
   - Firebase config and project IDs live in environment variables / config files.
   - No secrets committed to the repo.
