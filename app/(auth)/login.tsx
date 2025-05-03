import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Button } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { auth } from "@/config/firebaseConfig";
import { loginUser, resetPassword } from "@/utils/auth";
import {
  ensureUserDocumentExists,
  fetchUserPreferences,
} from "@/utils/firestore";
import { useUserPreferences } from "@/context/userPreferences";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function LoginScreen() {
  const user = auth.currentUser;

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const { updatePreferences } = useUserPreferences();

  const handleReset = async () => {
    try {
      await resetPassword(email);
      Toast.show({
        type: "success",
        text1: "Password reset email sent",
        visibilityTime: 2000,
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Failed to reset password. Please try again.",
        visibilityTime: 2000,
      });
    }
  };
  const checkAgreement = async () => {
    if (!user) return;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const agreed = userDoc.data().agreedToTerms;
      if (!agreed) {
        router.replace("/termsOfUse");
      } else {
        router.replace("/dashboard");
      }
    }
  };
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginUser(email, password);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not found");
      await ensureUserDocumentExists();
      const prefs = await fetchUserPreferences(currentUser.uid);
      if (prefs) updatePreferences(prefs);
      await loginUser(email, password);
      await checkAgreement();

      router.replace("/dashboard");
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes("auth/wrong-password")) {
        Toast.show({
          type: "error",
          text1: "Invalid password.",
          visibilityTime: 2000,
        });
      } else if (message.includes("auth/user-not-found")) {
        Toast.show({
          type: "error",
          text1: "No account found.",
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed.",
          visibilityTime: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <View>
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
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.signupText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                mode="contained-tonal"
                style={{ marginTop: 20 }}
                buttonColor="#86508f"
                textColor="#fffdfb"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
              >
                LOGIN
              </Button>
            </View>

            <View style={styles.link}>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.signupText}>
                  Don't have an account? Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
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
    height: height * 0.4,
    width: width * 0.7,
    resizeMode: "contain",
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
    borderBottomColor: "#86508f",
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
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    marginTop: 20,
    color: "#1d5ea4",
  },
});
