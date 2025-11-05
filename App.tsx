/**
 * TrackFinance App
 * Family Bill Tracker - Android-first mobile app
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './app/contexts/AuthContext';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
