/**
 * Tests for Users Service
 */

import {
  getUserProfile,
  saveUserProfile,
  saveDeviceToken,
} from '../../services/users';
import * as firestore from 'firebase/firestore';
import type { UserRole } from '../../types';

jest.mock('firebase/firestore');
jest.mock('../../services/firebaseApp');

describe('Users Service', () => {
  const mockFirestore = {} as firestore.Firestore;
  const mockDocRef = {} as firestore.DocumentReference;

  beforeEach(() => {
    jest.clearAllMocks();
    const { getFirebaseFirestore } = require('../../services/firebaseApp');
    getFirebaseFirestore.mockReturnValue(mockFirestore);
    (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
  });

  describe('getUserProfile', () => {
    it('should retrieve a user profile by ID', async () => {
      const mockUserData = {
        displayName: 'Test User',
        role: 'father' as UserRole,
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        deviceTokens: ['token1', 'token2'],
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-02') },
      };

      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUserData,
      });

      const result = await getUserProfile('user-123');

      expect(firestore.doc).toHaveBeenCalledWith(mockFirestore, 'users', 'user-123');
      expect(firestore.getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toEqual({
        id: 'user-123',
        displayName: 'Test User',
        role: 'father',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        deviceTokens: ['token1', 'token2'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });
    });

    it('should return null if user does not exist', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      const result = await getUserProfile('non-existent-user');

      expect(result).toBeNull();
    });

    it('should handle users with empty device tokens', async () => {
      const mockUserData = {
        displayName: 'New User',
        role: 'child' as UserRole,
        email: 'child@example.com',
        phoneNumber: '',
        deviceTokens: undefined, // No tokens yet
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };

      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockUserData,
      });

      const result = await getUserProfile('user-456');

      expect(result?.deviceTokens).toEqual([]);
    });
  });

  describe('saveUserProfile', () => {
    it('should create a new user profile if user does not exist', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('new-user-123', 'Father User', 'father', 'father@example.com', '+1234567890');

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          displayName: 'Father User',
          role: 'father',
          email: 'father@example.com',
          phoneNumber: '+1234567890',
          deviceTokens: [],
        })
      );
      expect(firestore.updateDoc).not.toHaveBeenCalled();
    });

    it('should update existing user profile', async () => {
      const existingUserData = {
        displayName: 'Old Name',
        role: 'father' as UserRole,
        email: 'old@example.com',
        phoneNumber: '+9876543210',
        deviceTokens: ['token1'],
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };

      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => existingUserData,
      });
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('existing-user', 'Updated Name', 'father', 'new@example.com');

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          displayName: 'Updated Name',
          role: 'father',
          email: 'new@example.com',
          phoneNumber: '+9876543210', // Should preserve existing phone
        })
      );
      expect(firestore.setDoc).not.toHaveBeenCalled();
    });

    it('should preserve existing email and phone if not provided', async () => {
      const existingUserData = {
        displayName: 'Test User',
        role: 'child' as UserRole,
        email: 'existing@example.com',
        phoneNumber: '+1111111111',
        deviceTokens: [],
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };

      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => existingUserData,
      });
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('user-123', 'Test User', 'child');

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          email: 'existing@example.com',
          phoneNumber: '+1111111111',
        })
      );
    });

    it('should create user with empty email and phone if not provided', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('new-user', 'New User', 'child');

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          displayName: 'New User',
          role: 'child',
          email: '',
          phoneNumber: '',
        })
      );
    });
  });

  describe('saveDeviceToken', () => {
    it('should add device token to user profile', async () => {
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveDeviceToken('user-123', 'new-device-token-xyz');

      expect(firestore.doc).toHaveBeenCalledWith(mockFirestore, 'users', 'user-123');
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          deviceTokens: expect.anything(),
        })
      );
    });

    it('should use arrayUnion to prevent duplicate tokens', async () => {
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveDeviceToken('user-456', 'token-abc');

      expect(firestore.arrayUnion).toHaveBeenCalledWith('token-abc');
    });

    it('should update the updatedAt timestamp', async () => {
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveDeviceToken('user-789', 'token-def');

      const call = (firestore.updateDoc as jest.Mock).mock.calls[0];
      expect(call[0]).toBe(mockDocRef);
      expect(call[1]).toHaveProperty('updatedAt');
      expect(call[1]).toHaveProperty('deviceTokens');
    });
  });
});
