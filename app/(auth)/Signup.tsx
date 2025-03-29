import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "@/config/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
import { registerUser } from "../../utils/auth"; // Firebase authentication function

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
    <View style={styles.container}>
      {/* Logo Image */}
      <Image
        style={styles.image}
        source={require("../../assets/images/vira.png")}
      />
      <StatusBar style="auto" />

      {/* Email Input */}
      <View style={styles.insideCont}>
        <View style={styles.inputs}>
          <View style={styles.inputView}>
            <AntDesign
              name="user"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputView}>
            <MaterialIcons
              name="password"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.TextInput}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
          </View>
        </View>
        {/* Signup Button */}
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>

        {/* Navigate to Login */}
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.signupText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🔹 Styles from your provided code (Adapted to Theme)
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    color: lightTheme.accent,
  },
  insideCont: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bottom: 80,
    width: "100%",
  },
  image: {
    height: 450,
    width: 250,
    marginBottom: 10,
  },

  mainText: {
    color: "black",
    marginBottom: 10,
  },
  inputView: {
    // backgroundColor: lightTheme.accent, \
    // opacity: 0.5,
    display: "flex",
    borderRadius: 20,
    width: "70%",
    height: 50,
    marginBottom: 20,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: lightTheme.accent3,
    // backgroundColor: lightTheme.secondary,
    // Android elevation
    elevation: 5,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 5,
    width: "80%",
    color: "black",
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    color: "#003f5c",
  },
  inputs: {
    display: "flex",
    gap: 20,
    color: "black",
    width: "100%",
    alignItems: "center",
    // justifyContent: "center",
    // position: "absolute",
  },
  signupBtn: {
    width: "40%",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    color: "black",
    borderWidth: 3,
    borderColor: lightTheme.accent,
    borderStyle: "solid",
    // backgroundColor: lightTheme.accent, // Use secondary color for the button
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
    color: "#007BFF",
  },
});
