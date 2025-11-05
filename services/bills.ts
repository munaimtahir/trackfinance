/**
 * Bills Service
 * Handles all operations related to bills in Firestore
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebaseApp';
import { uploadImage, generateBillImagePath, generateReceiptImagePath } from './storage';
import type { Bill, BillStatus, CreateBillPayload, MarkPaidPayload } from '../types';

const BILLS_COLLECTION = 'bills';

/**
 * Create a new bill
 */
export async function createBill(
  payload: CreateBillPayload,
  userId: string
): Promise<Bill> {
  const firestore = getFirebaseFirestore();
  const billsRef = collection(firestore, BILLS_COLLECTION);

  // Create bill document first to get ID
  const now = new Date();
  const billData = {
    createdBy: userId,
    title: payload.title || 'Untitled Bill',
    description: payload.description || '',
    amount: payload.amount,
    currency: payload.currency || 'PKR',
    category: payload.category,
    dueDate: payload.dueDate ? Timestamp.fromDate(payload.dueDate) : null,
    status: 'pending' as BillStatus,
    billImageUrl: '', // Will be updated after upload
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const docRef = await addDoc(billsRef, billData);
  const billId = docRef.id;

  // Upload image to Firebase Storage
  const imagePath = generateBillImagePath(billId, userId);
  const billImageUrl = await uploadImage(payload.billImageUri, imagePath);

  // Update document with image URL
  await updateDoc(docRef, { billImageUrl });

  // Return the created bill
  return {
    id: billId,
    ...billData,
    billImageUrl,
    dueDate: payload.dueDate,
    createdAt: now,
    updatedAt: now,
  } as Bill;
}

/**
 * Get a single bill by ID
 */
export async function getBill(billId: string): Promise<Bill | null> {
  const firestore = getFirebaseFirestore();
  const billRef = doc(firestore, BILLS_COLLECTION, billId);
  const billDoc = await getDoc(billRef);

  if (!billDoc.exists()) {
    return null;
  }

  return mapFirestoreBillToApp(billId, billDoc.data());
}

/**
 * Get bills by status
 */
export async function getBillsByStatus(status: BillStatus): Promise<Bill[]> {
  const firestore = getFirebaseFirestore();
  const billsRef = collection(firestore, BILLS_COLLECTION);
  const q = query(
    billsRef,
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => mapFirestoreBillToApp(doc.id, doc.data()));
}

/**
 * Subscribe to bills by status (real-time updates)
 */
export function subscribeToBillsByStatus(
  status: BillStatus,
  callback: (bills: Bill[]) => void
): Unsubscribe {
  const firestore = getFirebaseFirestore();
  const billsRef = collection(firestore, BILLS_COLLECTION);
  const q = query(
    billsRef,
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const bills = querySnapshot.docs.map((doc) =>
      mapFirestoreBillToApp(doc.id, doc.data())
    );
    callback(bills);
  });
}

/**
 * Mark a bill as paid
 */
export async function markBillAsPaid(
  billId: string,
  userId: string,
  payload: MarkPaidPayload
): Promise<void> {
  const firestore = getFirebaseFirestore();
  const billRef = doc(firestore, BILLS_COLLECTION, billId);

  const updateData: Record<string, unknown> = {
    status: 'paid' as BillStatus,
    payerNote: payload.payerNote || '',
    updatedAt: Timestamp.fromDate(new Date()),
  };

  // Upload receipt image if provided
  if (payload.receiptImageUri) {
    const imagePath = generateReceiptImagePath(billId, userId);
    const receiptImageUrl = await uploadImage(payload.receiptImageUri, imagePath);
    updateData.receiptImageUrl = receiptImageUrl;
  }

  await updateDoc(billRef, updateData);
}

/**
 * Map Firestore document data to Bill type
 */
function mapFirestoreBillToApp(id: string, data: DocumentData): Bill {
  return {
    id,
    createdBy: data.createdBy,
    assignedTo: data.assignedTo,
    title: data.title,
    description: data.description,
    amount: data.amount,
    currency: data.currency || 'PKR',
    category: data.category,
    dueDate: data.dueDate ? data.dueDate.toDate() : undefined,
    status: data.status,
    billImageUrl: data.billImageUrl,
    receiptImageUrl: data.receiptImageUrl,
    payerNote: data.payerNote,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}
