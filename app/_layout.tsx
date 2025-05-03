// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Slot } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OfflineWrapper } from '../components/OfflineWrapper';
import { UserPreferencesProvider } from '../context/userPreferences';
import { CheckInProvider } from '../context/checkInContext';
import { MealLogProvider } from '../context/mealLogContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import 'react-native-reanimated';

import Toast from 'react-native-toast-message';
export default function RootLayout() {
  const [ready, setReady] = useState(false);

  // wait for auth (or any other boot logic)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => setReady(true));
    return unsub;
  }, []);

  if (!ready) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (

      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <UserPreferencesProvider>
            <CheckInProvider>
              <MealLogProvider>
                <Slot />
                <Toast />
              </MealLogProvider>
            </CheckInProvider>
          </UserPreferencesProvider>
        </PaperProvider>
      </GestureHandlerRootView>

  );
}
