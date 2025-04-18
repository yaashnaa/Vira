import React from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { logoutUser } from '../../utils/auth'; // adjust the path as needed

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call your Firebase logout function.
      await logoutUser();
      await AsyncStorage.removeItem('@user');
      // Navigate the user to the login screen.
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return <Button title="Logout" onPress={handleLogout} />;
}
