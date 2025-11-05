/**
 * Tests for Auth Service
 */

import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  subscribeToAuthState,
} from '../../services/auth';
import * as firebaseAuth from 'firebase/auth';

// Mock Firebase Auth
jest.mock('firebase/auth');
jest.mock('../../services/firebaseApp');

describe('Auth Service', () => {
  const mockAuth = {} as firebaseAuth.Auth;
  const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
  } as firebaseAuth.User;

  beforeEach(() => {
    jest.clearAllMocks();
    const { getFirebaseAuth } = require('../../services/firebaseApp');
    getFirebaseAuth.mockReturnValue(mockAuth);
  });

  describe('signIn', () => {
    it('should sign in a user with email and password', async () => {
      const mockUserCredential = { user: mockUser };
      (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await signIn('test@example.com', 'password123');

      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
      expect(result).toEqual({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
      });
    });

    it('should throw error on invalid credentials', async () => {
      const mockError = new Error('Invalid credentials');
      (firebaseAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(signIn('wrong@example.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signUp', () => {
    it('should create a new user account', async () => {
      const mockUserCredential = { user: mockUser };
      (firebaseAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await signUp('new@example.com', 'password123');

      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'new@example.com',
        'password123'
      );
      expect(result).toEqual({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
      });
    });
  });

  describe('signOut', () => {
    it('should sign out the current user', async () => {
      (firebaseAuth.signOut as jest.Mock).mockResolvedValue(undefined);

      await signOut();

      expect(firebaseAuth.signOut).toHaveBeenCalledWith(mockAuth);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current authenticated user', () => {
      mockAuth.currentUser = mockUser;

      const result = getCurrentUser();

      expect(result).toEqual({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
      });
    });

    it('should return null if no user is authenticated', () => {
      mockAuth.currentUser = null;

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('subscribeToAuthState', () => {
    it('should subscribe to authentication state changes', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      (firebaseAuth.onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe);

      const unsubscribe = subscribeToAuthState(mockCallback);

      expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith(
        mockAuth,
        expect.any(Function)
      );
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
