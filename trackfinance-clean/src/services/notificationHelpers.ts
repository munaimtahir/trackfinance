/**
 * Notifications Helper
 * Helper functions for managing notifications between father and child
 */

import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserRole } from '../../types';

/**
 * Get the other user (child if current is father, or father if current is child)
 * This assumes a two-user system as per MVP requirements
 */
export async function getOtherUser(currentUserId: string, targetRole: UserRole): Promise<string | null> {
  try {
    const usersRef = collection(db, 'users');
    
    // Query for a user with the target role (the query will return users,
    // and we'll filter out the current user below since Firestore doesn't
    // support != operator in queries)
    const q = query(
      usersRef,
      where('role', '==', targetRole),
      limit(2) // Get 2 to check if current user is returned
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Find a user that is not the current user
    for (const doc of querySnapshot.docs) {
      const userId = doc.id;
      if (userId !== currentUserId) {
        return userId;
      }
    }
    
    // No other user found
    return null;
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
