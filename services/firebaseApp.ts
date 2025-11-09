/**
 * Firebase App Configuration
 * Initializes Firebase with environment variables
 * Uses AsyncStorage persistence for Auth in React Native
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  initializeAuth,
  indexedDBLocalPersistence,
  Auth 
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import type { FirebaseConfig } from '../types';

let firebaseApp: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

/**
 * Get Firebase configuration from environment variables
 */
export function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  };

  // Validate config
  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn(
      'Missing Firebase configuration keys:',
      missingKeys.join(', '),
      '\nPlease check your .env file or environment variables.'
    );
  }

  return config;
}

/**
 * Initialize Firebase app with Auth persistence for React Native
 * Uses initializeAuth with indexedDBLocalPersistence for proper React Native support
 * This fixes the "Component auth has not been registered yet" error
 */
export function initializeFirebase(): void {
  // Check if already initialized
  if (getApps().length > 0) {
    firebaseApp = getApp();
    // Auth should already be initialized, just retrieve the instances
    firestore = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    return;
  }

  const config = getFirebaseConfig();
  firebaseApp = initializeApp(config);
  
  // Initialize Auth with indexedDB persistence
  // Using initializeAuth instead of getAuth fixes the "Component auth has not been registered" error
  // in React Native environments
  try {
    auth = initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence,
    });
  } catch (error) {
    // If auth already initialized (e.g., hot reload), this is expected
    // The auth instance is already stored in the module variable
    if (error instanceof Error && error.message.includes('already created')) {
      // Auth is already initialized, no action needed
    } else {
      throw error;
    }
  }
  
  firestore = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
  }
  if (!auth) {
    throw new Error('Firebase Auth could not be initialized');
  }
  return auth;
}

/**
 * Get Firestore instance
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    initializeFirebase();
  }
  if (!firestore) {
    throw new Error('Firestore could not be initialized');
  }
  return firestore;
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    initializeFirebase();
  }
  if (!storage) {
    throw new Error('Firebase Storage could not be initialized');
  }
  return storage;
}
