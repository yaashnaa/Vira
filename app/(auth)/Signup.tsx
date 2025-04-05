import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "@/config/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { auth } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { registerUser } from "../../utils/auth"; // Firebase authentication function

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      await registerUser(email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        await AsyncStorage.setItem("@currentUserId", currentUser.uid);
      }

      Alert.alert("Signup Successful!");
      router.replace("/quizzes/basic"); // Redirect to Home Screen
    } catch (error) {
      Alert.alert("Signup Failed", (error as Error).message);
    }
  };
  return (
    <View style={styles.container}>
      {/* Logo Image */}
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
                {/* Confirm Password Input */}
                <View style={styles.inputView}>
                  <MaterialIcons
                  name="password"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10 }}
                  />
                  <TextInput
                  style={styles.TextInput}
                  placeholder="Confirm Password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry
                  onChangeText={(text) => setConfirmPassword(text)}
                  />
                </View>
              </View>

              <Button
                mode="contained-tonal"
                buttonColor="#86508f"
                textColor="#fffdfb"
                onPress={handleSignup}
              >
                <Text style={styles.loginText}>SIGN UP</Text>
              </Button>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.link}>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.signupText}>Already have an account? Login</Text>
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
  insideCont: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    bottom: 0,
    width: width * 0.7,
  },
  link: {
    bottom: 105,
    position: "absolute",
  },
  image: {
    height: 400,
    width: 400,
    top: 40,
    marginBottom: 10,
  },

  mainText: {
    color: "#000000",
    marginBottom: 10,
  },
  inputView: {
    display: "flex",
    borderRadius: 20,
    width: "100%",
    height: 40,
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
    marginTop: 40,
    color: "black",
    borderWidth: 3,
    borderColor: "#000000",
    borderStyle: "solid",
    // backgroundColor: lightTheme.accent, // Use secondary color for the button
  },
  loginText: {
    color: "#f8f5fa",
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
    color: "#1d5ea4",
  },
});
