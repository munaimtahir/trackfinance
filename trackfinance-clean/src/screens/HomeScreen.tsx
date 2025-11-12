/**
 * Home Screen
 * Main screen for adding new bills
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/Button';
import { useCreateBill } from '../hooks/useBills';
import { useCurrentUser } from '../hooks/useUser';
import type { CreateBillPayload } from '../../types';

export function HomeScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { createBill, loading } = useCreateBill();
  const { userProfile } = useCurrentUser();

  const isFather = userProfile?.role === 'father';

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to select images');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take photos');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please add a bill image');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a bill title');
      return;
    }

    const payload: CreateBillPayload = {
      title: title.trim(),
      description: description.trim(),
      amount: amount ? parseFloat(amount) : undefined,
      billImageUri: imageUri,
    };

    try {
      await createBill(payload);
      Alert.alert('Success', 'Bill created successfully ✅');
      // Reset form
      setTitle('');
      setDescription('');
      setAmount('');
      setImageUri(null);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create bill');
    }
  };

  // Show message for child users
  if (!isFather) {
    return (
      <View style={styles.container}>
        <View style={styles.childMessageContainer}>
          <Text style={styles.childMessageTitle}>👤 Child View</Text>
          <Text style={styles.childMessage}>
            Only the father can add new bills.{'\n\n'}
            You can view and manage bills in the "Bills" tab.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Add New Bill</Text>

        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <Button title="Change Image" onPress={pickImage} variant="secondary" style={styles.changeButton} />
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            <Button title="Take Photo" onPress={takePhoto} style={styles.imageButton} />
            <Button title="Choose from Gallery" onPress={pickImage} variant="secondary" style={styles.imageButton} />
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Bill Title (e.g., Electricity Bill - Nov)"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Amount (optional)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          editable={!loading}
        />

        <Button
          title="Submit Bill"
          onPress={handleSubmit}
          loading={loading}
          disabled={!imageUri || !title.trim()}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
  },
  changeButton: {
    marginTop: 8,
  },
  buttonGroup: {
    marginBottom: 24,
  },
  imageButton: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    marginTop: 8,
  },
  childMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  childMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  childMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
