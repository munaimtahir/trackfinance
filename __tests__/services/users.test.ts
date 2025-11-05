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
        displayName: 'John Doe',
        role: 'father' as UserRole,
        email: 'john@example.com',
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
      expect(result).not.toBeNull();
      expect(result?.id).toBe('user-123');
      expect(result?.displayName).toBe('John Doe');
      expect(result?.role).toBe('father');
      expect(result?.email).toBe('john@example.com');
      expect(result?.phoneNumber).toBe('+1234567890');
      expect(result?.deviceTokens).toEqual(['token1', 'token2']);
      expect(result?.createdAt).toEqual(new Date('2024-01-01'));
      expect(result?.updatedAt).toEqual(new Date('2024-01-02'));
    });

    it('should return null if user does not exist', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      const result = await getUserProfile('non-existent');

      expect(result).toBeNull();
    });

    it('should handle user with empty deviceTokens array', async () => {
      const mockUserData = {
        displayName: 'Jane Doe',
        role: 'child' as UserRole,
        email: 'jane@example.com',
        phoneNumber: '',
        deviceTokens: [],
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
    it('should create a new user profile if it does not exist', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('user-123', 'John Doe', 'father', 'john@example.com', '+1234567890');

      expect(firestore.doc).toHaveBeenCalledWith(mockFirestore, 'users', 'user-123');
      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          displayName: 'John Doe',
          role: 'father',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          deviceTokens: [],
        })
      );
      expect(firestore.updateDoc).not.toHaveBeenCalled();
    });

    it('should create user with empty email and phone if not provided', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('user-123', 'John Doe', 'father');

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          email: '',
          phoneNumber: '',
        })
      );
    });

    it('should update existing user profile', async () => {
      const existingUserData = {
        displayName: 'John Doe',
        role: 'father',
        email: 'old@example.com',
        phoneNumber: '+1111111111',
        deviceTokens: ['token1'],
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };

      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => existingUserData,
      });
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('user-123', 'John Smith', 'father', 'new@example.com', '+2222222222');

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          displayName: 'John Smith',
          role: 'father',
          email: 'new@example.com',
          phoneNumber: '+2222222222',
        })
      );
      expect(firestore.setDoc).not.toHaveBeenCalled();
    });

    it('should keep existing email and phone when not provided in update', async () => {
      const existingUserData = {
        displayName: 'John Doe',
        role: 'father',
        email: 'existing@example.com',
        phoneNumber: '+1111111111',
        deviceTokens: ['token1'],
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };

      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => existingUserData,
      });
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('user-123', 'John Smith', 'father');

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          email: 'existing@example.com',
          phoneNumber: '+1111111111',
        })
      );
    });

    it('should handle child role', async () => {
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (firestore.setDoc as jest.Mock).mockResolvedValue(undefined);

      await saveUserProfile('user-456', 'Jane Doe', 'child', 'jane@example.com');

      expect(firestore.setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          displayName: 'Jane Doe',
          role: 'child',
        })
      );
    });
  });

  describe('saveDeviceToken', () => {
    it('should save a device token to user profile', async () => {
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);
      (firestore.arrayUnion as jest.Mock).mockReturnValue(['token1', 'new-token']);

      await saveDeviceToken('user-123', 'new-token');

      expect(firestore.doc).toHaveBeenCalledWith(mockFirestore, 'users', 'user-123');
      expect(firestore.arrayUnion).toHaveBeenCalledWith('new-token');
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          deviceTokens: ['token1', 'new-token'],
        })
      );
    });

    it('should handle multiple device tokens', async () => {
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);
      (firestore.arrayUnion as jest.Mock).mockReturnValue(['token1', 'token2', 'token3']);

      await saveDeviceToken('user-123', 'token3');

      expect(firestore.arrayUnion).toHaveBeenCalledWith('token3');
    });

    it('should throw error if update fails', async () => {
      const mockError = new Error('Update failed');
      (firestore.updateDoc as jest.Mock).mockRejectedValue(mockError);

      await expect(saveDeviceToken('user-123', 'new-token')).rejects.toThrow('Update failed');
    });
  });
});
