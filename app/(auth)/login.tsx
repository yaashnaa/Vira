import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { darkTheme, lightTheme } from "@/config/theme";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { auth } from "../../config/firebaseConfig";
import Toast from "react-native-toast-message";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform, ActivityIndicator
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { loginUser,resetPassword } from "../../utils/auth"; 
import { fetchUserPreferences } from "@/utils/firestore";
import { useUserPreferences } from "@/context/userPreferences"; // Custom hook for user preferences
import { ensureUserDocumentExists } from "../../utils/firestore"; // Function to ensure user document exists
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const { updatePreferences } =
    useUserPreferences();
    const handleReset = async () => {
      try {
        await resetPassword(email);
        router.push("/(auth)/login");
      } catch {
        Toast.show({
          type: "error",
          text1: "Failed to reset password. Please try again.",
          visibilityTime: 2000,
        });
      }
    };
  
  const handleLogin = async () => {
    setErrorMessage("");
    setIsLoading(true); // Start spinner

    try {
      await loginUser(email, password);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Toast.show({
          type: "error",
          text1: "User not found",
          visibilityTime: 2000,
        });
        return;
      }

      await ensureUserDocumentExists();
      const prefs = await fetchUserPreferences(currentUser.uid);
      if (prefs) {
        updatePreferences(prefs);
      }

      router.replace("/dashboard");
    } catch (error) {
      const message = (error as Error).message;

      if (message.includes("auth/wrong-password")) {
        Toast.show({
          type: "error",
          text1: "Invalid password. Please try again.",
          visibilityTime: 2000,
        });
      } else if (message.includes("auth/user-not-found")) {
        Toast.show({
          type: "error",
          text1: "No account found with this email.",
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed. Please check your details.",
          visibilityTime: 2000,
        });
      }
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const redirectUri = "https://auth.expo.io/@yg2348/vira";

    console.log("✅ Redirect URI to add in Google Cloud:", redirectUri);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
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
                onLoadEnd={() => setImageLoading(false)} // hide loader once loaded
              />
            </View>

            <View style={styles.insideCont}>
              {errorMessage !== "" && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
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

              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.forgot_button}>Forgot Password?</Text>
              </TouchableOpacity>
              <Button
                mode="contained-tonal"  
                buttonColor="#86508f"
                textColor="#fefefe"
                onPress={handleLogin}
                loading={isLoading} 
                disabled={isLoading} 
              >
                LOGIN
              </Button>
          
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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
    // bottom: 120,
  },
  insideCont: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // top: 50,
    alignSelf: "center",
    bottom: 0,
    width: width * 0.7,
  },
  image: {
    height: 300,
    width: 350,
    bottom: 80,
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
    // marginBottom: 30,
    color: "#003f5c",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    // marginTop: 12,
    fontFamily: "Main-font",
    textAlign: "center",
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