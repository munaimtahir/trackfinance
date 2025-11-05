/**
 * User Hooks
 * Custom React hooks for managing user profile
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, saveUserProfile } from '../../services/users';
import { useAuth } from '../contexts/AuthContext';
import type { User, UserRole } from '../../types';

/**
 * Hook to fetch current user's profile
 */
export function useCurrentUser() {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authUser) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getUserProfile(authUser.uid)
      .then((profile) => {
        setUserProfile(profile);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
        setLoading(false);
      });
  }, [authUser]);

  const refresh = useCallback(async () => {
    if (!authUser) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await getUserProfile(authUser.uid);
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  return { userProfile, loading, error, refresh };
}

/**
 * Hook to save user profile
 */
export function useSaveUserProfile() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveProfile = useCallback(
    async (displayName: string, role: UserRole): Promise<void> => {
      if (!authUser) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      setError(null);

      try {
        await saveUserProfile(authUser.uid, displayName, role, authUser.email || undefined);
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save user profile');
        setError(error);
        setLoading(false);
        throw error;
      }
    },
    [authUser]
  );

  return { saveProfile, loading, error };
}
