# Testing Guide for TrackFinance

This document provides instructions for testing TrackFinance to ensure all features work correctly before deployment.

## Prerequisites

- Two Android devices (or one device + emulator)
- Expo Go app installed on both devices
- Firebase project configured
- App running on both devices

## Test Environment Setup

### Option 1: Two Physical Devices (Recommended)
1. Install Expo Go on both devices
2. Run `npm start` on your development machine
3. Scan QR code on both devices

### Option 2: One Device + Emulator
1. Install Android Studio and set up emulator
2. Run `npm start` then press `a` for Android
3. Scan QR code on physical device with Expo Go

## Test Accounts Setup

Create two test accounts for testing:

**Father Account**:
- Email: `father.test@example.com`
- Password: `TestPassword123!`
- Role: Father

**Child Account**:
- Email: `child.test@example.com`
- Password: `TestPassword123!`
- Role: Child

## End-to-End Testing Workflow

### 1. Authentication Tests

#### Test 1.1: Sign Up (Father)
- [ ] Open app on Device 1
- [ ] Tap "Don't have an account? Sign Up"
- [ ] Enter email: `father.test@example.com`
- [ ] Enter password: `TestPassword123!`
- [ ] Tap "Sign Up"
- [ ] Verify: Redirected to Profile Setup screen

#### Test 1.2: Profile Setup (Father)
- [ ] Enter name: "Test Father"
- [ ] Select role: "Father"
- [ ] Tap "Continue"
- [ ] Verify: Redirected to app home screen (Add Bill tab)

#### Test 1.3: Sign Up (Child)
- [ ] Open app on Device 2
- [ ] Tap "Don't have an account? Sign Up"
- [ ] Enter email: `child.test@example.com`
- [ ] Enter password: `TestPassword123!`
- [ ] Tap "Sign Up"
- [ ] Verify: Redirected to Profile Setup screen

#### Test 1.4: Profile Setup (Child)
- [ ] Enter name: "Test Child"
- [ ] Select role: "Child"
- [ ] Tap "Continue"
- [ ] Verify: Redirected to app home screen

#### Test 1.5: Sign Out and Sign In
- [ ] On Device 1, go to Bills tab (if profile screen exists)
- [ ] Sign out (implement if not available)
- [ ] Sign in with father credentials
- [ ] Verify: Redirected to home screen without profile setup

### 2. Role-Based UI Tests

#### Test 2.1: Father UI
- [ ] On Device 1 (Father account)
- [ ] Verify: "Add Bill" tab is visible and functional
- [ ] Verify: "Bills" tab is visible
- [ ] Tap "Add Bill" tab
- [ ] Verify: Can see "Add New Bill" form

#### Test 2.2: Child UI
- [ ] On Device 2 (Child account)
- [ ] Verify: "Add Bill" tab is visible but shows message
- [ ] Tap "Add Bill" tab
- [ ] Verify: Shows "Only the father can add new bills" message
- [ ] Verify: "Bills" tab is visible

### 3. Bill Creation Tests

#### Test 3.1: Create Bill with Camera
- [ ] On Device 1 (Father)
- [ ] Tap "Add Bill" tab
- [ ] Tap "Take Photo"
- [ ] Grant camera permission
- [ ] Take photo of a bill
- [ ] Crop and confirm
- [ ] Enter title: "Electricity Bill - November 2025"
- [ ] Enter description: "Monthly electricity charge"
- [ ] Enter amount: "5000"
- [ ] Tap "Create Bill"
- [ ] Verify: Success message appears
- [ ] Verify: Form resets
- [ ] Verify: Bill appears in Bills tab (Pending section)

#### Test 3.2: Create Bill from Gallery
- [ ] On Device 1 (Father)
- [ ] Tap "Add Bill" tab
- [ ] Tap "Choose from Gallery"
- [ ] Grant gallery permission
- [ ] Select an image
- [ ] Enter title: "Water Bill - November 2025"
- [ ] Leave description and amount empty
- [ ] Tap "Create Bill"
- [ ] Verify: Bill created successfully

#### Test 3.3: Validation
- [ ] On Device 1 (Father)
- [ ] Tap "Add Bill" tab
- [ ] Leave image empty
- [ ] Enter title: "Test Bill"
- [ ] Tap "Create Bill"
- [ ] Verify: Error message "Please add a bill image"
- [ ] Add image but leave title empty
- [ ] Tap "Create Bill"
- [ ] Verify: Error message "Please enter a bill title"

### 4. Real-Time Sync Tests

#### Test 4.1: Bill Appears on Child Device
- [ ] On Device 1 (Father), create a new bill
- [ ] On Device 2 (Child), tap "Bills" tab
- [ ] Verify: New bill appears in Pending section within 2 seconds
- [ ] Verify: Bill shows correct title, date, and image

#### Test 4.2: Multiple Bills Sync
- [ ] On Device 1 (Father), create 3 bills quickly
- [ ] On Device 2 (Child), observe Bills tab
- [ ] Verify: All 3 bills appear in order
- [ ] Verify: Most recent bill appears first

### 5. Push Notification Tests

**Note**: Push notifications require development build or production build. Expo Go on SDK 54+ has limited notification support on Android.

#### Test 5.1: New Bill Notification (Development Build)
- [ ] Ensure both devices have development build installed
- [ ] On Device 2 (Child), minimize app (don't close)
- [ ] On Device 1 (Father), create a new bill
- [ ] On Device 2 (Child), wait 5 seconds
- [ ] Verify: Notification appears: "New Bill Added 💰"
- [ ] Tap notification
- [ ] Verify: App opens to bills list

#### Test 5.2: Bill Paid Notification (Development Build)
- [ ] On Device 1 (Father), minimize app
- [ ] On Device 2 (Child), mark a bill as paid
- [ ] On Device 1 (Father), wait 5 seconds
- [ ] Verify: Notification appears: "Bill Paid ✅"
- [ ] Tap notification
- [ ] Verify: App opens

### 6. Bill Payment Tests

#### Test 6.1: Mark as Paid (Basic)
- [ ] On Device 2 (Child), tap "Bills" tab
- [ ] Tap on a pending bill
- [ ] Verify: Bill details screen opens
- [ ] Verify: "Mark as Paid" button is visible
- [ ] Tap "Mark as Paid"
- [ ] Tap "Confirm Payment" (without adding receipt or note)
- [ ] Verify: Success message appears
- [ ] Verify: Bill moves to Paid section
- [ ] On Device 1 (Father), check Bills tab
- [ ] Verify: Bill appears in Paid section

#### Test 6.2: Mark as Paid with Receipt and Note
- [ ] On Device 2 (Child), tap on a pending bill
- [ ] Tap "Mark as Paid"
- [ ] Tap "Add Receipt (Optional)"
- [ ] Select an image from gallery
- [ ] Enter note: "Paid via online banking"
- [ ] Tap "Confirm Payment"
- [ ] Verify: Success message appears
- [ ] Tap on the paid bill again
- [ ] Verify: Receipt image is displayed
- [ ] Verify: Payment note is displayed
- [ ] On Device 1 (Father), view same bill
- [ ] Verify: Receipt and note are visible

#### Test 6.3: Father Cannot Mark as Paid
- [ ] On Device 1 (Father), tap on a pending bill
- [ ] Verify: "Mark as Paid" button is NOT visible or disabled
- [ ] Or verify: Appropriate message shown

### 7. Image Upload Tests

#### Test 7.1: Bill Image Upload
- [ ] On Device 1 (Father), create bill with large image (>5MB if possible)
- [ ] Verify: Upload succeeds (image is compressed)
- [ ] On Device 2 (Child), view bill
- [ ] Verify: Image loads correctly

#### Test 7.2: Receipt Image Upload
- [ ] On Device 2 (Child), mark bill as paid with receipt
- [ ] Verify: Receipt uploads successfully
- [ ] On Device 1 (Father), view bill
- [ ] Verify: Receipt image displays

### 8. Bills List Tests

#### Test 8.1: Pending Bills Tab
- [ ] On Device 2 (Child), tap "Bills" tab
- [ ] Verify: Default tab is "Pending"
- [ ] Verify: Only pending bills are shown
- [ ] Verify: Bills are ordered by creation date (newest first)

#### Test 8.2: Paid Bills Tab
- [ ] Tap "Paid" tab
- [ ] Verify: Only paid bills are shown
- [ ] Verify: Bills show payment date
- [ ] Verify: Bills ordered by payment date (newest first)

#### Test 8.3: Empty States
- [ ] Mark all bills as paid
- [ ] On "Pending" tab
- [ ] Verify: Shows "No pending bills" message
- [ ] On "Paid" tab
- [ ] Verify: Shows list of paid bills

### 9. Offline Behavior Tests

#### Test 9.1: Create Bill Offline
- [ ] On Device 1 (Father), turn off WiFi and cellular
- [ ] Try to create a bill
- [ ] Verify: Appropriate error message
- [ ] Turn on internet
- [ ] Retry creating bill
- [ ] Verify: Bill creates successfully

#### Test 9.2: View Bills Offline
- [ ] On Device 2 (Child), load bills list
- [ ] Turn off internet
- [ ] Tap on a bill
- [ ] Verify: Can view bill details (cached data)
- [ ] Try to mark as paid
- [ ] Verify: Appropriate error message

### 10. Error Handling Tests

#### Test 10.1: Invalid Login
- [ ] Sign out from app
- [ ] Try to login with wrong password
- [ ] Verify: Error message appears
- [ ] Verify: Can retry login

#### Test 10.2: Network Errors
- [ ] Simulate poor network (use network throttling)
- [ ] Try to create bill
- [ ] Verify: Loading indicator shows
- [ ] Verify: Timeout error message appears if fails

### 11. Data Persistence Tests

#### Test 11.1: Auth Persistence
- [ ] Sign in on Device 1
- [ ] Force close app
- [ ] Reopen app
- [ ] Verify: Still signed in
- [ ] Verify: Redirected to home screen

#### Test 11.2: Bills Persistence
- [ ] Create several bills
- [ ] Force close app on both devices
- [ ] Reopen both apps
- [ ] Verify: All bills are still visible

### 12. Security Tests

#### Test 12.1: Unauthenticated Access
- [ ] Sign out from app
- [ ] Verify: Cannot access any screens without login
- [ ] Verify: Redirected to login screen

#### Test 12.2: Role Enforcement
- [ ] On Child account, verify cannot create bills
- [ ] On Father account, verify can create bills

## Automated Testing

Run automated tests:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- __tests__/services/bills.test.ts
```

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All manual tests passed
- [ ] All automated tests passed (npm test)
- [ ] Lint checks passed (npm run lint)
- [ ] Type checks passed (npm run type-check)
- [ ] Tested on at least 2 devices
- [ ] Notifications tested (development build)
- [ ] Firebase rules deployed
- [ ] Environment variables configured correctly
- [ ] No console errors in app
- [ ] App performance is acceptable
- [ ] Images upload and display correctly
- [ ] Real-time sync works reliably

## Known Issues and Limitations

1. **Expo Go Notifications**: Push notifications don't work fully in Expo Go on Android (SDK 54+). Use development build for testing.

2. **Image Size**: Very large images (>10MB) may take time to upload on slow connections.

3. **Offline Sync**: Firebase doesn't support offline writes, so bills cannot be created offline.

## Troubleshooting

### Issue: Bills Not Syncing
- Check internet connection
- Verify Firebase rules are deployed
- Check Firestore permissions in Firebase Console
- Look for errors in console logs

### Issue: Notifications Not Working
- Verify using development build (not Expo Go)
- Check device notification permissions
- Verify device tokens are saved in Firestore
- Check Firebase Cloud Messaging configuration

### Issue: Images Not Uploading
- Check Storage rules in Firebase Console
- Verify internet connection
- Check image file size
- Look for errors in console logs

### Issue: Login Fails
- Verify Firebase Auth is enabled
- Check email/password authentication is enabled
- Verify credentials are correct
- Check internet connection

## Reporting Issues

When reporting issues:
1. Include device model and OS version
2. Include steps to reproduce
3. Include screenshots if applicable
4. Include console logs
5. Specify if using Expo Go or development build
