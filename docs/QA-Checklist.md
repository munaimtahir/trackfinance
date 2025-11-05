# QA Checklist

## Authentication & Profile Setup
- [ ] User can sign in with email and password
- [ ] On first login, user sees profile setup screen
- [ ] User can enter their name and select role (father or child)
- [ ] Profile is saved and user proceeds to main app
- [ ] User stays logged in on app restart

## Father Workflow
- [ ] Father can log in without confusion
- [ ] Father can:
  - [ ] See "Add Bill" tab with bill creation form
  - [ ] Open camera to take a bill photo
  - [ ] Choose from gallery to select a bill photo
  - [ ] See image preview after selection
  - [ ] Enter bill title (required)
  - [ ] Enter optional description
  - [ ] Enter optional amount
  - [ ] Submit bill and see success message "Bill created successfully ✅"
  - [ ] Form resets after successful submission
  - [ ] See error if trying to submit without image or title

## Child Workflow
- [ ] Child can log in
- [ ] Child can:
  - [ ] See "Add Bill" tab with message that only father can add bills
  - [ ] Navigate to "Bills" tab
  - [ ] See new pending bills in Pending tab
  - [ ] Open bill detail by tapping on a bill
  - [ ] See "Mark as Paid" button only for pending bills
  - [ ] Tap "Mark as Paid" to open payment modal
  - [ ] Add optional payment note
  - [ ] Attach optional receipt screenshot
  - [ ] Confirm payment
  - [ ] See bill move to Paid tab after marking as paid

## Bills List
- [ ] Both users can see bills organized in two tabs:
  - [ ] Pending tab shows only pending bills
  - [ ] Paid tab shows only paid bills
- [ ] Each bill shows:
  - [ ] Thumbnail image
  - [ ] Title
  - [ ] Created date
- [ ] Empty state shows appropriate message:
  - [ ] "No pending bills" when Pending tab is empty
  - [ ] "No paid bills yet" when Paid tab is empty
- [ ] Pull to refresh updates bill list
- [ ] Real-time updates: Bills appear immediately after creation

## Bill Details
- [ ] Bill detail shows:
  - [ ] Full-size bill image
  - [ ] Title
  - [ ] Status badge (Pending/Paid)
  - [ ] Created date
  - [ ] Description (if provided)
  - [ ] Amount (if provided)
- [ ] For paid bills, also shows:
  - [ ] Receipt image (if provided)
  - [ ] Payment note (if provided)
- [ ] "Mark as Paid" button:
  - [ ] Only visible to child role
  - [ ] Only visible for pending bills
  - [ ] Not visible for paid bills
  - [ ] Not visible to father role

## Role-Based Access
- [ ] Father role:
  - [ ] Can create bills in "Add Bill" tab
  - [ ] Cannot see "Mark as Paid" button
- [ ] Child role:
  - [ ] Sees informational message in "Add Bill" tab
  - [ ] Can see "Mark as Paid" button for pending bills
  - [ ] Can mark bills as paid with receipt and note

## Status Updates
- [ ] Bills move from Pending to Paid list correctly
- [ ] Status badge updates from "Pending" to "Paid"
- [ ] Updates are reflected in real-time for all users

## Error Handling
- [ ] App shows user-friendly error messages (no raw stack traces)
- [ ] App handles network errors gracefully
- [ ] App handles permission denials for camera/gallery
- [ ] Failed uploads don't create incomplete bills

## Notifications
- [x] Child receives a notification when a bill is created
- [x] Father receives a notification when bill is marked paid
- [x] Users can register for push notifications on app startup
- [x] Device tokens are stored in user profiles
- [x] Notifications are sent via Expo Push API (client-side for MVP)
- [ ] (Optional) Cloud Functions for server-side notification handling

## Offline Support (Future Phase)
- [ ] If father is offline, app allows capturing a bill
- [ ] When back online, the bill syncs automatically
