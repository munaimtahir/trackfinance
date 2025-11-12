/**
 * Firebase Configuration for TrackFinance
 * Using Firebase JS SDK - simplified for React Native
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Get Firebase config from Expo Constants (which reads from app.config.js extra)
const firebaseConfig = Constants.expoConfig?.extra?.firebase;

if (!firebaseConfig) {
  console.error('Firebase configuration not found in expo config');
  console.error('Please check app.config.js and environment variables');
}

// Initialize Firebase App
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth - Firebase SDK will automatically use AsyncStorage in React Native
const auth: Auth = getAuth(app);

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Storage
const storage: FirebaseStorage = getStorage(app);

// Export instances
export { auth, db, storage };
export default app;
