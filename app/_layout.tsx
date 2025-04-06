import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, View, LogBox } from "react-native";
import { Stack, useRouter, Slot, Link } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { UserPreferencesProvider } from "../context/userPreferences";
import { MoodProvider } from "@/context/moodContext";
import { Provider } from "react-native-paper";
import "react-native-get-random-values";
import { MealLogProvider } from "@/context/mealLogContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components",
  "Text strings must be rendered within a <Text> component."
]);
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
        router.replace("/dashboard");
      } else {
        setIsAuthenticated(false);
        router.replace("/(auth)/login");
      }
    });
    return unsubscribe;
  }, [hasMounted, router]);

  // While loading, render a basic navigator with a loading indicator
  if (!hasMounted || isAuthenticated === null) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <GestureHandlerRootView>
      <Provider>
        <UserPreferencesProvider>
          <MoodProvider>
            <MealLogProvider>
              <Slot />
            </MealLogProvider>
          </MoodProvider>
        </UserPreferencesProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
function HomeButton() {
  return (
    <Link href="/dashboard">
      <Ionicons
        name="home"
        size={24}
        color="black"
        style={{ marginLeft: 15 }}
      />
    </Link>
  );
}

function ManageWidgets() {
  return (
    <Link href="/manageWidgets">
      <MaterialCommunityIcons name="dots-grid" size={24} color="black" />
    </Link>
  );
}

