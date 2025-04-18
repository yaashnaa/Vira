import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "@/config/theme";
import Header from "@/components/header";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { auth } from "../../config/firebaseConfig";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { loginUser } from "../../utils/auth"; // Firebase authentication function
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserPreferences } from "@/utils/firestore";
import { useUserPreferences } from "@/context/userPreferences"; // Custom hook for user preferences
import { ensureUserDocumentExists } from "../../utils/firestore"; // Function to ensure user document exists
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { updatePreferences, updatePreferencesFromFirestore } =
    useUserPreferences();

  const handleLogin = async () => {
    try {
      await loginUser(email, password); // 🔐 logs in with Firebase Auth

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not found.");
        return;
      }

      await ensureUserDocumentExists(); // ✅ no need to pass UID
      const prefs = await fetchUserPreferences(currentUser.uid);
      if (prefs) {
        updatePreferences(prefs); // ✅ updates context from Firestore only
      }

      router.replace("/dashboard"); // ✅ route to dashboard
    } catch (error) {
      Alert.alert("Login Failed", (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/Vira.png")}
      />
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              // flexGrow: 1,
              justifyContent: "center",
              padding: 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.insideCont}>
              <View style={styles.inputs}>
                <View style={styles.inputView}>
                  <AntDesign
                    name="user"
                    size={24}
                    color="#150b01"
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
                    placeholderTextColor="#0c5e84"
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                  />
                </View>
              </View>

              <TouchableOpacity>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.button}>
        <Button
          mode="contained-tonal"
          buttonColor="#86508f"
          textColor="#fefefe"
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </Button>
      </View>

      <View style={styles.link}>
        <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    color: lightTheme.accent,
  },
  link: {
    bottom: 65,
    position: "absolute",
  },
  button: {
    bottom: 120,
  },
  insideCont: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    top: 50,
    bottom: 0,
    width: width * 0.7,
  },
  image: {
    height: 400,
    width: 400,
    top: 40,
    marginBottom: 10,
  },

  mainText: {
    color: "#150b01",
    marginBottom: 10,
  },
  inputView: {
    display: "flex",
    borderRadius: 20,
    width: "100%",
    height: 50,
    marginBottom: 20,

    alignItems: "center",
    flexDirection: "row",
    gap: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: lightTheme.accent3,
    elevation: 5,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 5,
    width: "100%",
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
    borderColor: "#150b01",
    borderStyle: "solid",
    // backgroundColor: lightTheme.accent, // Use secondary color for the button
  },
  loginText: {
    color: "#f5f0f9",
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
    color: "#1d5ea4",
  },
});
