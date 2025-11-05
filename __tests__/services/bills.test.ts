/**
 * Tests for Bills Service
 */

import {
  createBill,
  getBill,
  getBillsByStatus,
  subscribeToBillsByStatus,
  markBillAsPaid,
} from '../../services/bills';
import * as firestore from 'firebase/firestore';
import * as storage from '../../services/storage';
import type { CreateBillPayload, MarkPaidPayload } from '../../types';

jest.mock('firebase/firestore');
jest.mock('../../services/firebaseApp');
jest.mock('../../services/storage');

describe('Bills Service', () => {
  const mockFirestore = {} as firestore.Firestore;
  const mockCollectionRef = {} as firestore.CollectionReference;
  const mockDocRef = { id: 'bill-123' } as firestore.DocumentReference;

  beforeEach(() => {
    jest.clearAllMocks();
    const { getFirebaseFirestore } = require('../../services/firebaseApp');
    getFirebaseFirestore.mockReturnValue(mockFirestore);
    (firestore.collection as jest.Mock).mockReturnValue(mockCollectionRef);
  });

  describe('createBill', () => {
    it('should create a new bill with uploaded image', async () => {
      const payload: CreateBillPayload = {
        title: 'Test Bill',
        description: 'Test Description',
        amount: 100,
        billImageUri: 'file:///test.jpg',
      };

      (firestore.addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (storage.uploadImage as jest.Mock).mockResolvedValue('https://example.com/bill.jpg');
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);
      (storage.generateBillImagePath as jest.Mock).mockReturnValue('bills/user/bill-123/bill.jpg');

      const result = await createBill(payload, 'user-123');

      expect(firestore.addDoc).toHaveBeenCalled();
      expect(storage.uploadImage).toHaveBeenCalledWith('file:///test.jpg', 'bills/user/bill-123/bill.jpg');
      expect(firestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        billImageUrl: 'https://example.com/bill.jpg',
      });
      expect(result.id).toBe('bill-123');
      expect(result.title).toBe('Test Bill');
      expect(result.status).toBe('pending');
    });

    it('should use default title if none provided', async () => {
      const payload: CreateBillPayload = {
        title: '',
        billImageUri: 'file:///test.jpg',
      };

      (firestore.addDoc as jest.Mock).mockResolvedValue(mockDocRef);
      (storage.uploadImage as jest.Mock).mockResolvedValue('https://example.com/bill.jpg');
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      const result = await createBill(payload, 'user-123');

      expect(result.title).toBe('Untitled Bill');
    });
  });

  describe('getBill', () => {
    it('should retrieve a bill by ID', async () => {
      const mockData = {
        createdBy: 'user-123',
        title: 'Test Bill',
        status: 'pending',
        billImageUrl: 'https://example.com/bill.jpg',
        currency: 'PKR',
        createdAt: { toDate: () => new Date('2024-01-01') },
        updatedAt: { toDate: () => new Date('2024-01-01') },
      };

      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        data: () => mockData,
      });

      const result = await getBill('bill-123');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('bill-123');
      expect(result?.title).toBe('Test Bill');
    });

    it('should return null if bill does not exist', async () => {
      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });

      const result = await getBill('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getBillsByStatus', () => {
    it('should retrieve bills filtered by status', async () => {
      const mockDocs = [
        {
          id: 'bill-1',
          data: () => ({
            title: 'Bill 1',
            status: 'pending',
            billImageUrl: 'url1',
            currency: 'PKR',
            createdAt: { toDate: () => new Date() },
            updatedAt: { toDate: () => new Date() },
          }),
        },
      ];

      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.getDocs as jest.Mock).mockResolvedValue({
        docs: mockDocs,
      });

      const result = await getBillsByStatus('pending');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('bill-1');
    });
  });

  describe('subscribeToBillsByStatus', () => {
    it('should subscribe to real-time bill updates', () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();

      (firestore.query as jest.Mock).mockReturnValue({});
      (firestore.onSnapshot as jest.Mock).mockReturnValue(mockUnsubscribe);

      const unsubscribe = subscribeToBillsByStatus('pending', mockCallback);

      expect(firestore.onSnapshot).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });

  describe('markBillAsPaid', () => {
    it('should mark a bill as paid with optional receipt', async () => {
      const payload: MarkPaidPayload = {
        payerNote: 'Paid via bank',
        receiptImageUri: 'file:///receipt.jpg',
      };

      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (storage.uploadImage as jest.Mock).mockResolvedValue('https://example.com/receipt.jpg');
      (storage.generateReceiptImagePath as jest.Mock).mockReturnValue('bills/user/bill-123/receipt.jpg');
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await markBillAsPaid('bill-123', 'user-123', payload);

      expect(storage.uploadImage).toHaveBeenCalledWith('file:///receipt.jpg', 'bills/user/bill-123/receipt.jpg');
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          status: 'paid',
          payerNote: 'Paid via bank',
          receiptImageUrl: 'https://example.com/receipt.jpg',
        })
      );
    });

    it('should mark bill as paid without receipt', async () => {
      const payload: MarkPaidPayload = {
        payerNote: 'Paid via cash',
      };

      (firestore.doc as jest.Mock).mockReturnValue(mockDocRef);
      (firestore.updateDoc as jest.Mock).mockResolvedValue(undefined);

      await markBillAsPaid('bill-123', 'user-123', payload);

      expect(storage.uploadImage).not.toHaveBeenCalled();
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          status: 'paid',
          payerNote: 'Paid via cash',
        })
      );
    });
  });
});
