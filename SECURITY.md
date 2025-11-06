# Security Documentation

## Overview

TrackFinance implements multiple layers of security to protect user data and ensure proper access control.

## Authentication

### Email/Password Authentication
- Uses Firebase Authentication for user management
- Passwords are hashed and stored securely by Firebase
- Auth state persists across app restarts
- Users must be authenticated to access any app features

### Implementation
- Located in: `services/auth.ts`
- Auth context: `app/contexts/AuthContext.tsx`
- Screens: `app/screens/LoginScreen.tsx`, `app/screens/ProfileSetupScreen.tsx`

## Firestore Security Rules

### Users Collection
```javascript
match /users/{userId} {
  // Anyone authenticated can read user profiles
  // Needed to look up device tokens for notifications
  allow read: if request.auth != null;
  
  // Users can only write their own profile
  allow write: if request.auth.uid == userId;
}
```

**Purpose**: 
- Prevents unauthorized access to user profiles
- Allows users to update only their own profile
- Enables cross-user lookups for notifications (read-only)

### Bills Collection
```javascript
match /bills/{billId} {
  // Anyone authenticated can read bills
  allow read: if request.auth != null;
  
  // Any authenticated user can create a bill
  allow create: if request.auth != null;
  
  // Only the bill creator can update their bill
  allow update: if request.auth.uid == resource.data.userId;
  
  // No deletions allowed for audit trail
  allow delete: if false;
}
```

**Purpose**:
- Ensures both father and child can view all bills
- Prevents unauthorized bill modifications
- Maintains audit trail by disallowing deletions
- Bill creator can update status (e.g., mark as paid)

## Storage Security Rules

### Bill Images
```javascript
match /billImages/{userId}/{allImages=**} {
  // Anyone authenticated can read bill images
  allow read: if request.auth != null;
  
  // Users can only upload to their own folder
  allow write: if request.auth.uid == userId;
}
```

**Purpose**:
- Organizes images by user ID
- Prevents unauthorized image uploads
- Allows viewing images across users (father and child)
- Protects against image tampering

## Environment Variables

### Configuration Storage
All Firebase credentials are stored in environment variables:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

### Best Practices
✅ **DO**:
- Use `.env` file for credentials (never commit to Git)
- Use `.env.example` with placeholder values for documentation
- Validate environment variables at runtime

❌ **DON'T**:
- Hardcode credentials in source code
- Commit `.env` file to version control
- Share Firebase credentials publicly

## Role-Based Access Control

### User Roles
- **Father**: Can create bills, view all bills
- **Child**: Can view bills, mark as paid, add receipts

### Implementation
- Roles are stored in Firestore `users` collection
- UI components conditionally render based on role
- No server-side role enforcement (trust-based model for family use)

### Role Assignment
- Users select role during profile setup
- Role is saved to Firestore upon registration
- Cannot be changed after initial setup (requires manual database update)

## Device Tokens

### Push Notification Security
- Device tokens stored in Firestore `users.deviceTokens` array
- Tokens are Expo push notification tokens
- Only the user can update their own device tokens
- Notifications sent via Expo Push API (server-side recommended)

### Token Management
- Tokens registered on app launch
- Multiple tokens per user (multi-device support)
- Old tokens automatically removed by Expo (invalid tokens cleaned up)

## Data Privacy

### Personal Information
- **Stored**: Email, display name, role, device tokens
- **Not stored**: Phone numbers (unless user opts in), passwords (hashed by Firebase)

### Bill Information
- **Stored**: Title, description, amount, images, status, timestamps
- **Retention**: Bills are never deleted (audit trail)
- **Access**: Both father and child can view all bills

### Image Storage
- Images stored in Firebase Storage under `billImages/{userId}/`
- JPEG format, compressed for mobile
- Accessible by authenticated users only

## Known Limitations

### Client-Side Notifications
The current implementation sends notifications from the client app. This has limitations:
- Requires internet connectivity
- Can fail if app is closed
- Tokens exposed to client

**Recommendation**: Use Cloud Functions for production (template provided in `/functions`)

### No Bill Deletion
Bills cannot be deleted by users. This ensures audit trail but may accumulate data over time.

**Recommendation**: Implement admin tool or scheduled cleanup for old paid bills

### Trust-Based Access
The app assumes father and child are cooperative family members. There is no enforcement preventing:
- Child from creating bills (though UI hides this)
- Father from marking bills as paid
- Users from viewing other families' bills (requires knowing bill IDs)

**Recommendation**: For multi-family use, add `familyId` field and filter by family

## Security Checklist

Before deploying to production:

- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] `.env` file NOT in Git repository
- [ ] Firebase API keys rotated if accidentally exposed
- [ ] Auth email/password requirements enforced (Firebase Console)
- [ ] Budget alerts configured in Firebase
- [ ] Test unauthorized access attempts
- [ ] Verify role-based UI rendering
- [ ] Test with multiple devices/accounts
- [ ] Review Firebase Console security tab

## Incident Response

If Firebase credentials are compromised:

1. **Immediate Actions**:
   - Rotate API keys in Firebase Console
   - Update `.env` file with new credentials
   - Review Firebase Authentication logs for suspicious activity
   - Check Firestore/Storage logs for unauthorized access

2. **Rebuild and Redeploy**:
   - Update app with new credentials
   - Deploy new build to users
   - Force users to re-authenticate if needed

3. **Prevention**:
   - Use `.gitignore` to prevent `.env` commits
   - Enable GitHub secret scanning
   - Use Firebase App Check for additional protection (optional)

## Future Security Enhancements

Recommended improvements for broader deployment:

1. **Firebase App Check**: Prevent unauthorized API access
2. **Multi-Factor Authentication**: Add phone verification
3. **Cloud Functions**: Move notification logic server-side
4. **Rate Limiting**: Prevent abuse of bill creation
5. **Family Groups**: Add family ID to scope data access
6. **Admin Dashboard**: Manage users and data
7. **Encrypted Storage**: Encrypt sensitive bill data
8. **Audit Logging**: Log all data modifications

## References

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firebase Authentication Best Practices](https://firebase.google.com/docs/auth/best-practices)
- [Expo Security Considerations](https://docs.expo.dev/guides/security/)
