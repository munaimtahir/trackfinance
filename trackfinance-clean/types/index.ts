/**
 * Type definitions for TrackFinance app
 * Based on docs/DataModel.md
 */

export type UserRole = 'father' | 'child';

export interface User {
  id: string;
  displayName: string;
  role: UserRole;
  email?: string;
  phoneNumber?: string;
  deviceTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type BillStatus = 'pending' | 'paid';

export interface Bill {
  id: string;
  createdBy: string;
  assignedTo?: string;
  title: string;
  description?: string;
  amount?: number;
  currency: string;
  category?: string;
  dueDate?: Date;
  status: BillStatus;
  billImageUrl: string;
  receiptImageUrl?: string;
  payerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBillPayload {
  title: string;
  description?: string;
  amount?: number;
  currency?: string;
  category?: string;
  dueDate?: Date;
  billImageUri: string; // Local URI before upload
}

export interface MarkPaidPayload {
  receiptImageUri?: string; // Local URI before upload
  payerNote?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
