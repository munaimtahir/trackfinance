/**
 * Navigation Configuration
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentUser } from '../hooks/useUser';
import { useNotificationRegistration } from '../hooks/useNotifications';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { BillsListScreen } from '../screens/BillsListScreen';
import { BillDetailScreen } from '../screens/BillDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Add Bill',
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsListScreen}
        options={{
          title: 'Bills',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading, refresh } = useCurrentUser();
  
  // Register for push notifications when user is authenticated
  useNotificationRegistration();

  if (authLoading || (user && profileLoading)) {
    return null; // Could show a loading screen here
  }

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : !userProfile ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileSetup">
            {() => <ProfileSetupScreen onComplete={refresh} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="BillDetail"
            component={BillDetailScreen}
            options={{ title: 'Bill Details' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
