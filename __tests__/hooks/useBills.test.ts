/**
 * Tests for Bills Hooks
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useBills, useCreateBill, useMarkBillPaid } from '../../app/hooks/useBills';
import * as billsService from '../../services/bills';
import type { Bill } from '../../types';

jest.mock('../../services/bills');
jest.mock('../../app/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-user-id' } }),
}));

describe('Bills Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useBills', () => {
    it('should subscribe to bills and receive updates', async () => {
      const mockBills: Bill[] = [
        {
          id: 'bill-1',
          title: 'Test Bill',
          status: 'pending',
          createdBy: 'user-1',
          currency: 'PKR',
          billImageUrl: 'url',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (billsService.subscribeToBillsByStatus as jest.Mock).mockImplementation((_status, cb) => {
        setTimeout(() => cb(mockBills), 0);
        return jest.fn();
      });

      const { result } = renderHook(() => useBills('pending'));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.bills).toEqual(mockBills);
      expect(result.current.error).toBeNull();
    });

    it('should refresh bills on demand', async () => {
      const mockBills: Bill[] = [];
      (billsService.subscribeToBillsByStatus as jest.Mock).mockReturnValue(jest.fn());
      (billsService.getBillsByStatus as jest.Mock).mockResolvedValue(mockBills);

      const { result } = renderHook(() => useBills('pending'));

      await act(async () => {
        await result.current.refresh();
      });

      expect(billsService.getBillsByStatus).toHaveBeenCalledWith('pending');
    });
  });

  describe('useCreateBill', () => {
    it('should create a bill successfully', async () => {
      const mockBill: Bill = {
        id: 'bill-1',
        title: 'New Bill',
        status: 'pending',
        createdBy: 'test-user-id',
        currency: 'PKR',
        billImageUrl: 'url',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (billsService.createBill as jest.Mock).mockResolvedValue(mockBill);

      const { result } = renderHook(() => useCreateBill());

      let createdBill: Bill | null = null;
      await act(async () => {
        createdBill = await result.current.createBill({
          title: 'New Bill',
          billImageUri: 'file:///test.jpg',
        });
      });

      expect(createdBill).toEqual(mockBill);
      expect(result.current.error).toBeNull();
    });

    it('should handle creation errors', async () => {
      const mockError = new Error('Creation failed');
      (billsService.createBill as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateBill());

      await act(async () => {
        try {
          await result.current.createBill({
            title: 'New Bill',
            billImageUri: 'file:///test.jpg',
          });
        } catch (err) {
          // Expected error
        }
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useMarkBillPaid', () => {
    it('should mark a bill as paid successfully', async () => {
      (billsService.markBillAsPaid as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useMarkBillPaid());

      await act(async () => {
        await result.current.markAsPaid('bill-123', {
          payerNote: 'Paid',
        });
      });

      expect(billsService.markBillAsPaid).toHaveBeenCalledWith('bill-123', 'test-user-id', {
        payerNote: 'Paid',
      });
      expect(result.current.error).toBeNull();
    });

    it('should handle marking errors', async () => {
      const mockError = new Error('Update failed');
      (billsService.markBillAsPaid as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMarkBillPaid());

      await act(async () => {
        try {
          await result.current.markAsPaid('bill-123', {});
        } catch (err) {
          // Expected error
        }
      });

      expect(result.current.error).toEqual(mockError);
    });
  });
});
