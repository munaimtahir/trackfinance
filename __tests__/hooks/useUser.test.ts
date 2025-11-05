/**
 * Tests for User Hooks
 */

import { renderHook, act } from '@testing-library/react-native';
import { useCurrentUser, useSaveUserProfile } from '../../app/hooks/useUser';
import * as usersService from '../../services/users';
import * as AuthContext from '../../app/contexts/AuthContext';
import type { User, UserRole } from '../../types';

jest.mock('../../services/users');
jest.mock('../../app/contexts/AuthContext');

describe('User Hooks', () => {
  const mockAuthUser = {
    uid: 'user-123',
    email: 'test@example.com',
    displayName: null,
  };

  const mockUserProfile: User = {
    id: 'user-123',
    displayName: 'Test User',
    role: 'father' as UserRole,
    email: 'test@example.com',
    deviceTokens: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthContext.useAuth as jest.Mock).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn(),
    });
  });

  describe('useCurrentUser', () => {
    it('should fetch user profile on mount', async () => {
      (usersService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

      const { result } = renderHook(() => useCurrentUser());

      expect(result.current.loading).toBe(true);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(usersService.getUserProfile).toHaveBeenCalledWith('user-123');
      expect(result.current.userProfile).toEqual(mockUserProfile);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should return null when user is not authenticated', async () => {
      (AuthContext.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      const { result } = renderHook(() => useCurrentUser());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(usersService.getUserProfile).not.toHaveBeenCalled();
      expect(result.current.userProfile).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should handle errors when fetching user profile', async () => {
      const mockError = new Error('Failed to fetch');
      (usersService.getUserProfile as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useCurrentUser());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.userProfile).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });

    it('should refresh user profile on demand', async () => {
      (usersService.getUserProfile as jest.Mock).mockResolvedValue(mockUserProfile);

      const { result } = renderHook(() => useCurrentUser());

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(usersService.getUserProfile).toHaveBeenCalledTimes(1);

      const updatedProfile = { ...mockUserProfile, displayName: 'Updated Name' };
      (usersService.getUserProfile as jest.Mock).mockResolvedValue(updatedProfile);

      await act(async () => {
        await result.current.refresh();
      });

      expect(usersService.getUserProfile).toHaveBeenCalledTimes(2);
      expect(result.current.userProfile).toEqual(updatedProfile);
    });
  });

  describe('useSaveUserProfile', () => {
    it('should save user profile successfully', async () => {
      (usersService.saveUserProfile as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useSaveUserProfile());

      await act(async () => {
        await result.current.saveProfile('Test User', 'father');
      });

      expect(usersService.saveUserProfile).toHaveBeenCalledWith(
        'user-123',
        'Test User',
        'father',
        'test@example.com'
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors when saving user profile', async () => {
      const mockError = new Error('Save failed');
      (usersService.saveUserProfile as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useSaveUserProfile());

      await act(async () => {
        try {
          await result.current.saveProfile('Test User', 'father');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });

    it('should throw error when user is not authenticated', async () => {
      (AuthContext.useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn(),
      });

      const { result } = renderHook(() => useSaveUserProfile());

      await expect(
        act(async () => {
          await result.current.saveProfile('Test User', 'father');
        })
      ).rejects.toThrow('User not authenticated');
    });

    it('should save profile with child role', async () => {
      (usersService.saveUserProfile as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useSaveUserProfile());

      await act(async () => {
        await result.current.saveProfile('Child User', 'child');
      });

      expect(usersService.saveUserProfile).toHaveBeenCalledWith(
        'user-123',
        'Child User',
        'child',
        'test@example.com'
      );
    });
  });
});
