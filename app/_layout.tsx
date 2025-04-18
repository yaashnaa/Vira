import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, LogBox } from "react-native";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { UserPreferencesProvider } from "../context/userPreferences";
import { MoodProvider } from "@/context/moodContext";
import { Provider } from "react-native-paper";
import "react-native-get-random-values";
import { MealLogProvider } from "@/context/mealLogContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components",
  "Text strings must be rendered within a <Text> component.",
]);

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        router.replace("/dashboard");
      } else {
        setIsAuthenticated(false);
        router.replace("/(auth)/login");
      }
    });

    return unsubscribe;
  }, [hasMounted, router]);

  if (!hasMounted || isAuthenticated === null) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <UserPreferencesProvider>
          <MoodProvider>
            <MealLogProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right", // Global default
                }}
              >
                <Stack.Screen name="fitness" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="dashboard" options={{ animation: "fade" }} />
                <Stack.Screen name="journal" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="waterTracker" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="findExercise" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="logExercise" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="manageWidgets" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="mood" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="nurtition" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="previousJournalEntries" options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />

                {/* Add more screens here if you'd like to customize animation per screen */}
              </Stack>
            </MealLogProvider>
          </MoodProvider>
        </UserPreferencesProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
