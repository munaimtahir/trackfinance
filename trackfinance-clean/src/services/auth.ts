/**
 * Authentication Service
 * Wraps Firebase Auth operations
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(userCredential.user);
}

/**
 * Create a new user account
 */
export async function signUp(email: string, password: string): Promise<AuthUser> {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(userCredential.user);
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  return user ? mapFirebaseUser(user) : null;
}

/**
 * Subscribe to authentication state changes
 */
export function subscribeToAuthState(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}

/**
 * Map Firebase User to AuthUser
 */
function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}
