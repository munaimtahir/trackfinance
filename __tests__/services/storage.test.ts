/**
 * Tests for Storage Service
 */

import {
  uploadImage,
  generateBillImagePath,
  generateReceiptImagePath,
} from '../../services/storage';
import * as firebaseStorage from 'firebase/storage';

jest.mock('firebase/storage');
jest.mock('../../services/firebaseApp');

// Mock global fetch
global.fetch = jest.fn();

describe('Storage Service', () => {
  const mockStorage = {} as firebaseStorage.FirebaseStorage;
  const mockStorageRef = {} as firebaseStorage.StorageReference;

  beforeEach(() => {
    jest.clearAllMocks();
    const { getFirebaseStorage } = require('../../services/firebaseApp');
    getFirebaseStorage.mockReturnValue(mockStorage);
  });

  describe('uploadImage', () => {
    it('should upload an image and return download URL', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      (global.fetch as jest.Mock).mockResolvedValue({
        blob: jest.fn().mockResolvedValue(mockBlob),
      });

      (firebaseStorage.ref as jest.Mock).mockReturnValue(mockStorageRef);
      (firebaseStorage.uploadBytes as jest.Mock).mockResolvedValue({});
      (firebaseStorage.getDownloadURL as jest.Mock).mockResolvedValue(
        'https://example.com/image.jpg'
      );

      const result = await uploadImage('file:///path/to/image.jpg', 'bills/123/image.jpg');

      expect(firebaseStorage.ref).toHaveBeenCalledWith(mockStorage, 'bills/123/image.jpg');
      expect(firebaseStorage.uploadBytes).toHaveBeenCalledWith(mockStorageRef, mockBlob);
      expect(firebaseStorage.getDownloadURL).toHaveBeenCalledWith(mockStorageRef);
      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should throw error on upload failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(uploadImage('file:///path/to/image.jpg', 'bills/123/image.jpg')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('generateBillImagePath', () => {
    it('should generate a unique path for bill images', () => {
      const path = generateBillImagePath('bill-123', 'user-456');

      expect(path).toMatch(/^bills\/user-456\/bill-123\/bill-\d+\.jpg$/);
    });
  });

  describe('generateReceiptImagePath', () => {
    it('should generate a unique path for receipt images', () => {
      const path = generateReceiptImagePath('bill-123', 'user-456');

      expect(path).toMatch(/^bills\/user-456\/bill-123\/receipt-\d+\.jpg$/);
    });
  });
});
