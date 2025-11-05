/**
 * Profile Setup Screen
 * Allows user to set their role and display name on first login
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '../components/Button';
import { useSaveUserProfile } from '../hooks/useUser';
import type { UserRole } from '../../types';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { saveProfile, loading } = useSaveUserProfile();

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role');
      return;
    }

    try {
      await saveProfile(displayName.trim(), selectedRole);
      onComplete();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to save profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to TrackFinance</Text>
        <Text style={styles.subtitle}>Please complete your profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={displayName}
          onChangeText={setDisplayName}
          editable={!loading}
        />

        <Text style={styles.label}>Select Your Role</Text>

        <TouchableOpacity
          style={[
            styles.roleOption,
            selectedRole === 'father' && styles.roleOptionSelected,
          ]}
          onPress={() => setSelectedRole('father')}
          disabled={loading}
        >
          <Text
            style={[
              styles.roleText,
              selectedRole === 'father' && styles.roleTextSelected,
            ]}
          >
            👨 Father
          </Text>
          <Text style={styles.roleDescription}>Create and submit bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleOption,
            selectedRole === 'child' && styles.roleOptionSelected,
          ]}
          onPress={() => setSelectedRole('child')}
          disabled={loading}
        >
          <Text
            style={[
              styles.roleText,
              selectedRole === 'child' && styles.roleTextSelected,
            ]}
          >
            👤 Child
          </Text>
          <Text style={styles.roleDescription}>View bills and mark as paid</Text>
        </TouchableOpacity>

        <Button
          title="Continue"
          onPress={handleSubmit}
          loading={loading}
          disabled={!displayName.trim() || !selectedRole}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  roleOption: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  roleOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E8F4FF',
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  roleTextSelected: {
    color: '#007AFF',
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    marginTop: 24,
  },
});
