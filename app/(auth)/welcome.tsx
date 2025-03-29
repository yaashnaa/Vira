import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { darkTheme, lightTheme } from "@/config/theme"; // Custom theme hook

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  console.log("Checking auth state...");
  // ✅ Check if a user is logged in
  useEffect(() => {
    console.log("Checking auth state...");
    console.log("Auth State: ", auth.currentUser);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      setLoading(false);
      if (currentUser) {
        console.log("User is logged in:", currentUser.email); // Debugging check
        console.log("User detected:", currentUser);

        router.replace("/dashboard"); // ✅ Redirect to Home if logged in
        
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]); // ✅ Ensure router is in dependency array

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: lightTheme.background }]}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: lightTheme.background }]}>
      <Text style={[styles.title, { color: lightTheme.text }]}>Get Started</Text>
      <Text style={[styles.subtitle, { color: lightTheme.text }]}>
        Please log in or sign up to continue.
      </Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: lightTheme.primary }]} onPress={() => router.push("/signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "80%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
