/**
 * Notifications Helper
 * Helper functions for managing notifications between father and child
 */

import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebaseApp';
import type { UserRole } from '../types';

/**
 * Get the other user (child if current is father, or father if current is child)
 * This assumes a two-user system as per MVP requirements
 */
export async function getOtherUser(currentUserId: string, targetRole: UserRole): Promise<string | null> {
  try {
    const firestore = getFirebaseFirestore();
    const usersRef = collection(firestore, 'users');
    
    // Query for a user with the target role that is not the current user
    const q = query(
      usersRef,
      where('role', '==', targetRole),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Get the first user with the target role
    const otherUserDoc = querySnapshot.docs[0];
    const otherUserId = otherUserDoc.id;
    
    // Make sure it's not the current user
    if (otherUserId === currentUserId) {
      return null;
    }
    
    return otherUserId;
  } catch (error) {
    console.error('Failed to get other user:', error);
    return null;
  }
}

/**
 * Get child user ID (for father to notify child)
 */
export async function getChildUserId(currentUserId: string): Promise<string | null> {
  return getOtherUser(currentUserId, 'child');
}

/**
 * Get father user ID (for child to notify father)
 */
export async function getFatherUserId(currentUserId: string): Promise<string | null> {
  return getOtherUser(currentUserId, 'father');
}
