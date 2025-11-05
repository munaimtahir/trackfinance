/**
 * Bill Card Component
 * Displays a bill in a list
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { Bill } from '../../types';

interface BillCardProps {
  bill: Bill;
  onPress: () => void;
}

export function BillCard({ bill, onPress }: BillCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: bill.billImageUrl }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {bill.title}
        </Text>
        <Text style={styles.date}>{formatDate(bill.createdAt)}</Text>
        {bill.amount !== undefined && (
          <Text style={styles.amount}>
            {bill.currency} {bill.amount.toFixed(2)}
          </Text>
        )}
      </View>
      <View style={[styles.badge, bill.status === 'paid' ? styles.paidBadge : styles.pendingBadge]}>
        <Text style={styles.badgeText}>{bill.status === 'paid' ? 'Paid' : 'Pending'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
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
});
