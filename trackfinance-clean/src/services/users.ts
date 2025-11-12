/**
 * Users Service
 * Handles user profile and device token management
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  arrayUnion,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User, UserRole } from '../../types';

const USERS_COLLECTION = 'users';

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return mapFirestoreUserToApp(userId, userDoc.data());
}

/**
 * Create or update user profile
 */
export async function saveUserProfile(
  userId: string,
  displayName: string,
  role: UserRole,
  email?: string,
  phoneNumber?: string
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  
  const existingUser = await getDoc(userRef);
  const now = Timestamp.fromDate(new Date());

  if (existingUser.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      displayName,
      role,
      email: email || existingUser.data().email,
      phoneNumber: phoneNumber || existingUser.data().phoneNumber,
      updatedAt: now,
    });
  } else {
    // Create new user
    await setDoc(userRef, {
      displayName,
      role,
      email: email || '',
      phoneNumber: phoneNumber || '',
      deviceTokens: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}

/**
 * Save device token for push notifications
 */
export async function saveDeviceToken(userId: string, token: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);

  await updateDoc(userRef, {
    deviceTokens: arrayUnion(token),
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

/**
 * Map Firestore user document to User type
 */
function mapFirestoreUserToApp(id: string, data: DocumentData): User {
  return {
    id,
    displayName: data.displayName,
    role: data.role,
    email: data.email,
    phoneNumber: data.phoneNumber,
    deviceTokens: data.deviceTokens || [],
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}
