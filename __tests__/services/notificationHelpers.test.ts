/**
 * Tests for Notification Helpers
 */

import { getDocs } from 'firebase/firestore';
import {
  getOtherUser,
  getChildUserId,
  getFatherUserId,
} from '../../services/notificationHelpers';

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('../../services/firebaseApp', () => ({
  getFirebaseFirestore: jest.fn(() => ({})),
}));

describe('Notification Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOtherUser', () => {
    it('should return the other user with target role', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [
          {
            id: 'other-user-123',
          },
        ],
      });

      const otherUserId = await getOtherUser('current-user-123', 'child');

      expect(otherUserId).toBe('other-user-123');
    });

    it('should return null if no user found', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: true,
        docs: [],
      });

      const otherUserId = await getOtherUser('current-user-123', 'child');

      expect(otherUserId).toBeNull();
    });

    it('should return null if found user is the current user', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [
          {
            id: 'current-user-123',
          },
        ],
      });

      const otherUserId = await getOtherUser('current-user-123', 'child');

      expect(otherUserId).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error('Firestore error'));

      const otherUserId = await getOtherUser('current-user-123', 'child');

      expect(otherUserId).toBeNull();
    });
  });

  describe('getChildUserId', () => {
    it('should call getOtherUser with child role', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'child-123' }],
      });

      const childId = await getChildUserId('father-123');

      expect(childId).toBe('child-123');
    });
  });

  describe('getFatherUserId', () => {
    it('should call getOtherUser with father role', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'father-123' }],
      });

      const fatherId = await getFatherUserId('child-123');

      expect(fatherId).toBe('father-123');
    });
  });
});
