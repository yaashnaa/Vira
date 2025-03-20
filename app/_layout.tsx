// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Redirect to authenticated flow.
        router.replace('/(tabs)/home');
      } else {
        setIsAuthenticated(false);
        // Redirect to authentication flow.
        router.replace('/(auth)/Login');
      }
    });
    return unsubscribe;
  }, [router]);

  // Optionally, render a loading state while checking auth.
  if (isAuthenticated === null) {
    return null;
  }

  // Do not render any additional navigators here.
  // Expo Router will render the matching file-system route.
  return   <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="+not-found" />
</Stack>;
}
