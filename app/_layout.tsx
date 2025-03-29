import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useRouter, Slot } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { UserPreferencesProvider } from "../context/userPreferences";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Ensure the component has mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Listen for auth state changes once the layout has mounted
  useEffect(() => {
    if (!hasMounted) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        router.replace("/(auth)/home");
      } else {
        setIsAuthenticated(false);
        router.replace("/(auth)/login");
      }
    });
    return unsubscribe;
  }, [hasMounted, router]);

  // While loading, render a basic navigator with a loading indicator
  if (!hasMounted || isAuthenticated === null) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <UserPreferencesProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Slot />
        </Stack>
      </SafeAreaView>
    </UserPreferencesProvider>
  );
}
