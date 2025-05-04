import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Linking,
  Dimensions,
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { db, auth } from "@/config/firebaseConfig";

const { height } = Dimensions.get("window");

export default function TermsOfUseScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAgree = async () => {
    setLoading(true);
  
    try {
      // Always store agreement locally
      await AsyncStorage.setItem("agreedToTerms", "true");
  
      const user = auth.currentUser;
  
      if (user) {
        // If user is signed in, also update Firestore
        await setDoc(
          doc(db, "users", user.uid),
          { agreedToTerms: true },
          { merge: true }
        );
        router.replace("/dashboard");
      } else {
        // Otherwise go to login screen, sync later after login
        router.replace("/login");
      }
    } catch (error) {
      console.error("Failed to save agreement:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Terms of Use</Text>

      <Text style={styles.text}>
        By using Vira, you agree to behave respectfully and not post harmful,
        offensive, or inappropriate content.
        {"\n"}
        {"\n"}
        <Text style={{ fontWeight: "bold" }}>
          We have zero tolerance for objectionable content or abusive behavior.
          Violations may result in removal of your posts or suspension of your
          account.
        </Text>
      </Text>

      <Text
        style={styles.linkText}
        onPress={() =>
          Linking.openURL(
            "https://yaashnaa.github.io/vira-website/privacy.html"
          )
        }
      >
        Read our Privacy Policy
      </Text>
      <Text
        style={styles.linkText}
        onPress={() =>
          Linking.openURL("https://yaashnaa.github.io/vira-website/terms.html")
        }
      >
        Read our End User License Agreement (EULA)
      </Text>

      <View style={styles.checkboxRow}>
        <View
          style={{
            borderWidth: 0.6,
            borderColor: "#444",
            borderRadius: 4,
            marginRight: 10,
          }}
        >
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
          />
        </View>
        <Text style={styles.checkboxLabel}>
          I agree to the Terms of Use and Privacy Policy
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleAgree}
        disabled={!checked || loading}
        loading={loading}
        style={styles.button}
        labelStyle={{ color: "#ffffff" }}
      >
        Agree and Continue
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    minHeight: height,
    justifyContent: "center",
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#622f00",
    fontFamily: "Main-font",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  linkText: {
    color: "#1d5ea4",
    marginBottom: 10,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
    color: "#444",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#86508f",
    color: "#fff",
  },
});
