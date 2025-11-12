/**
 * Bill Detail Screen
 * Shows full bill details and allows marking as paid
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Button } from '../components/Button';
import { useBill, useMarkBillPaid } from '../hooks/useBills';
import { useCurrentUser } from '../hooks/useUser';
import type { MarkPaidPayload } from '../../types';

type BillDetailRouteParams = {
  BillDetail: {
    billId: string;
  };
};

export function BillDetailScreen() {
  const route = useRoute<RouteProp<BillDetailRouteParams, 'BillDetail'>>();
  const navigation = useNavigation();
  const { billId } = route.params;
  const { bill, loading } = useBill(billId);
  const { markAsPaid, loading: marking } = useMarkBillPaid();
  const { userProfile } = useCurrentUser();

  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [note, setNote] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  const canMarkAsPaid = userProfile?.role === 'child';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const pickReceiptImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleMarkAsPaid = async () => {
    const payload: MarkPaidPayload = {
      payerNote: note.trim() || undefined,
      receiptImageUri: receiptUri || undefined,
    };

    try {
      await markAsPaid(billId, payload);
      Alert.alert('Success', 'Bill marked as paid');
      setShowMarkPaidModal(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mark as paid');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!bill) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bill not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Image source={{ uri: bill.billImageUrl }} style={styles.billImage} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{bill.title}</Text>
            <View style={[styles.badge, bill.status === 'paid' ? styles.paidBadge : styles.pendingBadge]}>
              <Text style={styles.badgeText}>{bill.status === 'paid' ? 'Paid' : 'Pending'}</Text>
            </View>
          </View>

          <Text style={styles.date}>Created: {formatDate(bill.createdAt)}</Text>

          {bill.description && (
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{bill.description}</Text>
            </View>
          )}

          {bill.amount !== undefined && (
            <View style={styles.section}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>
                {bill.currency} {bill.amount.toFixed(2)}
              </Text>
            </View>
          )}

          {bill.status === 'paid' && (
            <>
              {bill.receiptImageUrl && (
                <View style={styles.section}>
                  <Text style={styles.label}>Receipt</Text>
                  <Image source={{ uri: bill.receiptImageUrl }} style={styles.receiptImage} />
                </View>
              )}
              {bill.payerNote && (
                <View style={styles.section}>
                  <Text style={styles.label}>Payment Note</Text>
                  <Text style={styles.value}>{bill.payerNote}</Text>
                </View>
              )}
            </>
          )}

          {bill.status === 'pending' && canMarkAsPaid && (
            <Button
              title="Mark as Paid"
              onPress={() => setShowMarkPaidModal(true)}
              style={styles.markPaidButton}
            />
          )}
        </View>
      </ScrollView>

      {/* Mark as Paid Modal */}
      <Modal
        visible={showMarkPaidModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMarkPaidModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mark Bill as Paid</Text>

            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (optional)"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />

            {receiptUri ? (
              <View style={styles.receiptPreview}>
                <Image source={{ uri: receiptUri }} style={styles.receiptImage} />
                <Button title="Change Receipt" onPress={pickReceiptImage} variant="secondary" />
              </View>
            ) : (
              <Button title="Add Receipt (optional)" onPress={pickReceiptImage} variant="secondary" />
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowMarkPaidModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Confirm"
                onPress={handleMarkAsPaid}
                loading={marking}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  billImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FFF3CD',
  },
  paidBadge: {
    backgroundColor: '#D1ECF1',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  markPaidButton: {
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  noteInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  receiptPreview: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
