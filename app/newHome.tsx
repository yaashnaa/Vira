import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { lightTheme } from "@/config/theme";

export default function NewHome() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/welcome");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: lightTheme.background }]}>
      <Text style={[styles.title, { color: lightTheme.text }]}>Welcome to NewHome!</Text>
      <TouchableOpacity style={[styles.button]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center"
  },
  title: {
    fontSize: 24, fontWeight: "bold"
  },
  button: {
    marginTop: 20, padding: 15, backgroundColor: "red", borderRadius: 10
  },
  buttonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold"
  }
});
