import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "@/config/theme";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "../utils/auth"; // Firebase authentication function

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await registerUser(email, password);
      Alert.alert("Signup Successful!");
      router.replace("/home"); // Redirect to Home Screen
    } catch (error) {
      Alert.alert("Signup Failed", (error as Error).message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: lightTheme.background }]}>
      {/* Logo Image */}
      <Image style={styles.image} source={require("../assets/images/vira.png")} />
      <StatusBar style="auto" />

      {/* Email Input */}
      <View style={[styles.inputView, { backgroundColor: lightTheme.accent }]}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={[styles.inputView, { backgroundColor: lightTheme.accent }]}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={[styles.signupBtn, { backgroundColor: lightTheme.secondary }]} onPress={handleSignup}>
        <Text style={styles.signupText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => router.push("/Login")}>
        <Text style={[styles.loginText, { color: lightTheme.text }]}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Styles from your provided code (Adapted to Theme)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    height: 350,
    width: 250,
    marginBottom: 20,
  },
  inputView: {
    opacity: 0.5,
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    width: "80%",
  },
  signupBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  signupText: {
    color: "white",
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
  },
});

