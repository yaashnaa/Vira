import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { darkTheme, lightTheme } from "@/config/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { auth } from "../../config/firebaseConfig";
import Toast from "react-native-toast-message"; // ✨ Added
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  ActivityIndicator, // ✨ Added
  Dimensions,
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { registerUser } from "../../utils/auth";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✨
  const [imageLoading, setImageLoading] = useState(true); // ✨

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        visibilityTime: 2000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(email, password);
      const currentUser = auth.currentUser;

      Toast.show({
        type: "success",
        text1: "Signup Successful!",
        visibilityTime: 2000,
      });

      router.replace("/quizzes/basic"); // Redirect to Quiz
    } catch (error: any) {
      const message = error.message ?? "";

      if (error.code === "auth/email-already-in-use") {
        Toast.show({
          type: "error",
          text1: "Account already exists",
          text2: "Please login instead or use another email.",
          visibilityTime: 2000,
        });
      } else if (error.code === "auth/weak-password") {
        Toast.show({
          type: "error",
          text1: "Password too short",
          text2: "Please enter at least 6 characters.",
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Signup Failed",

          visibilityTime: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ position: "relative", width: 350, height: 300 }}>
              {imageLoading && (
                <ActivityIndicator
                  size="large"
                  color="#86508f"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: -25,
                    marginTop: -25,
                  }}
                />
              )}
              <Image
                style={styles.image}
                source={require("../../assets/images/vira.png")}
                onLoadEnd={() => setImageLoading(false)} 
              />
            </View>

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
                loading={isLoading} // ✨ shows spinner inside
                disabled={isLoading} // optional disable during loading
              >
                SIGN UP
              </Button>
            </View>

            <View style={styles.link}>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.signupText}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    width: width * 0.7,
    marginTop: 10,
  },
  link: {
    marginTop: 30,
  },
  image: {
    height: 300,
    width: 350,
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
  inputs: {
    display: "flex",
    gap: 20,
    color: "black",
    width: "100%",
    alignItems: "center",
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
