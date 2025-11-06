# Changelog

All notable changes to TrackFinance will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-06

### Added
- Complete family bill tracking application for Android (Expo + Firebase)
- Email/password authentication with Firebase Auth
- Role-based access control (father and child roles)
- Bill creation with image capture/upload
- Bill payment workflow with optional receipt and notes
- Real-time bill synchronization across devices using Firestore
- Push notifications for new bills and payments (Expo Push Notifications)
- Firebase Storage integration for bill images and receipts
- User profile management with device token tracking
- Comprehensive test suite with Jest (12 test suites, 88 tests)
- TypeScript support throughout the codebase
- ESLint configuration for code quality
- Complete documentation:
  - Setup guide with Firebase configuration
  - Architecture documentation
  - Data model specification
  - QA checklist
  - Testing guidelines
- Firebase security rules for Firestore and Storage
- Cloud Functions templates for server-side notifications (optional)
- Continuous integration ready

### Security
- Firestore rules ensure users can only modify their own data
- Storage rules prevent unauthorized access to bill images
- Device tokens securely stored in Firestore users collection
- No deletions allowed in bills collection for audit trail
- Environment variables for Firebase configuration (not committed)

### Technical Details
- **Frontend**: React Native 0.81.5 with Expo SDK 54
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Messaging)
- **Language**: TypeScript 5.9.2
- **Testing**: Jest with React Native Testing Library
- **Navigation**: React Navigation 6.x
- **State Management**: React Context API

[1.0.0]: https://github.com/munaimtahir/trackfinance/releases/tag/v1.0.0
