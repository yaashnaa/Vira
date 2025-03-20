// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth/react-native";
import { auth } from "../config/firebaseConfig";
import { UserPreferencesProvider } from "../context/userPreferences"; // Import your context if needed
import { SafeAreaFrameContext, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Redirect to authenticated flow.
        router.replace("/(auth)/home");
      } else {
        setIsAuthenticated(false);
        // Redirect to authentication flow.
        router.replace("/(auth)/login");
      }
    });
    return unsubscribe;
  }, [router]);

  // Optionally, render a loading state while checking auth.
  if (isAuthenticated === null) {
    return null;
  }
  return (
    <UserPreferencesProvider>
      <SafeAreaView>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      </SafeAreaView>
    </UserPreferencesProvider>
  );
}
