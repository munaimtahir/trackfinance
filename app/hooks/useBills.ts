/**
 * Bills Hooks
 * Custom React hooks for managing bills
 */

import { useState, useEffect, useCallback } from 'react';
import {
  createBill as createBillService,
  getBillsByStatus,
  subscribeToBillsByStatus,
  markBillAsPaid as markBillAsPaidService,
  getBill,
} from '../../services/bills';
import { getChildUserId, getFatherUserId } from '../../services/notificationHelpers';
import { useAuth } from '../contexts/AuthContext';
import type { Bill, BillStatus, CreateBillPayload, MarkPaidPayload } from '../../types';

/**
 * Hook to fetch bills by status
 */
export function useBills(status: BillStatus) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToBillsByStatus(status, (updatedBills) => {
      setBills(updatedBills);
      setLoading(false);
    });

    return unsubscribe;
  }, [status]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBills = await getBillsByStatus(status);
      setBills(fetchedBills);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bills'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  return { bills, loading, error, refresh };
}

/**
 * Hook to fetch a single bill
 */
export function useBill(billId: string | null) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!billId) {
      setBill(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getBill(billId)
      .then((fetchedBill) => {
        setBill(fetchedBill);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to fetch bill'));
        setLoading(false);
      });
  }, [billId]);

  return { bill, loading, error };
}

/**
 * Hook to create a new bill
 */
export function useCreateBill() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBill = useCallback(
    async (payload: CreateBillPayload): Promise<Bill | null> => {
      if (!user) {
        setError(new Error('User not authenticated'));
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // Get child user ID for notification
        const childUserId = await getChildUserId(user.uid);
        
        const bill = await createBillService(payload, user.uid, childUserId || undefined);
        setLoading(false);
        return bill;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create bill');
        setError(error);
        setLoading(false);
        throw error;
      }
    },
    [user]
  );

  return { createBill, loading, error };
}

/**
 * Hook to mark a bill as paid
 */
export function useMarkBillPaid() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markAsPaid = useCallback(
    async (billId: string, payload: MarkPaidPayload): Promise<void> => {
      if (!user) {
        setError(new Error('User not authenticated'));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get father user ID for notification
        const fatherUserId = await getFatherUserId(user.uid);
        
        await markBillAsPaidService(billId, user.uid, payload, fatherUserId || undefined);
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to mark bill as paid');
        setError(error);
        setLoading(false);
        throw error;
      }
    },
    [user]
  );

  return { markAsPaid, loading, error };
}
