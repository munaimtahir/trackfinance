/**
 * Storage Service
 * Handles file uploads to Firebase Storage
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload an image to Firebase Storage
 * @param uri - Local file URI
 * @param path - Storage path (e.g., 'bills/bill-id/image.jpg')
 * @returns Download URL of the uploaded image
 */
export async function uploadImage(uri: string, path: string): Promise<string> {
  const storageRef = ref(storage, path);

  // Fetch the blob from the local URI
  const response = await fetch(uri);
  const blob = await response.blob();

  // Upload to Firebase Storage
  await uploadBytes(storageRef, blob);

  // Get and return the download URL
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

/**
 * Generate a unique file path for bill images
 */
export function generateBillImagePath(billId: string, userId: string): string {
  const timestamp = Date.now();
  return `bills/${userId}/${billId}/bill-${timestamp}.jpg`;
}

/**
 * Generate a unique file path for receipt images
 */
export function generateReceiptImagePath(billId: string, userId: string): string {
  const timestamp = Date.now();
  return `bills/${userId}/${billId}/receipt-${timestamp}.jpg`;
}
