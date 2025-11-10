/**
 * Firebase Configuration for TrackFinance
 * Using Firebase JS SDK with React Native AsyncStorage persistence
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  Auth 
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Initialize Auth with React Native AsyncStorage persistence
// This is critical for proper React Native support
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If auth is already initialized (hot reload), get existing instance
  if (error instanceof Error && error.message.includes('already created')) {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Storage
const storage: FirebaseStorage = getStorage(app);

// Export instances
export { auth, db, storage };
export default app;
