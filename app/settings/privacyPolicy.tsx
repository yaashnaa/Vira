import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>💬 Your Data, Your Choice</Text>
        <Text style={styles.text}>
          Vira is designed to protect your emotional space. We only collect what’s essential for your experience — and never more.
        </Text>

        <Text style={styles.sectionTitle}>🔐 What We Collect</Text>
        <Text style={styles.text}>
          - Basic info (like your email or name, if you choose to share it){"\n"}
          - Mood check-ins, journal entries, and preferences{"\n"}
          - Anonymous usage stats to improve the app{"\n"}
          {"\n"}
          Your reflections and feelings stay private — always.

        </Text>

        <Text style={styles.sectionTitle}>🧠 How We Use It</Text>
        <Text style={styles.text}>
          Your data is used to personalize your wellness experience. We do NOT sell your data, use it for ads, or share it with third parties without consent.
        </Text>

        <Text style={styles.sectionTitle}>☁️ Cloud Syncing</Text>
        <Text style={styles.text}>
          You can choose whether your data is stored locally on your device or backed up securely to the cloud. Syncing is optional and encrypted.
        </Text>

        <Text style={styles.sectionTitle}>👀 You’re in Control</Text>
        <Text style={styles.text}>
          You can edit or delete your account, entries, or preferences at any time in Settings. Want a break? You’re always welcome back — no judgment, no pressure.
        </Text>

        <Text style={styles.sectionTitle}>📞 Need Help?</Text>
        <Text style={styles.text}>
          If you have questions about privacy or data safety, you can contact our team at support@vira-app.com. We’re here to support you with transparency and care.
        </Text>

        <Button onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff0f6",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    textAlign: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Comfortaa-Regular",
    color: "#5e3a84",
    marginTop: 20,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#444",
    fontFamily: "Main-font",
    lineHeight: 22,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#ddceff",
  },
});
