import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import Header from "@/components/header";

export default function TermsOfService() {
  return (
    <>
      <Header title="Terms of Service" backPath="/settings" />
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>

          <Text style={styles.sectionTitle}>✨ Welcome to Vira</Text>
          <Text style={styles.text}>
            By using Vira, you agree to these Terms of Service. Our goal is to create a safe, supportive space for your personal growth and emotional wellness.
          </Text>

          <Divider style={{ marginVertical: 20 }} />

          <Text style={styles.sectionTitle}>📱 Your Use of Vira</Text>
          <Text style={styles.text}>
            Please use Vira respectfully and for its intended purpose — your personal well-being journey. You agree not to misuse the app, disrupt others, or attempt to access Vira in unauthorized ways.
          </Text>

          <Divider style={{ marginVertical: 20 }} />

          <Text style={styles.sectionTitle}>🔐 Your Privacy</Text>
          <Text style={styles.text}>
            Your privacy matters to us. Please also review our Privacy Policy to understand how your data is collected, used, and protected.
          </Text>

          <Divider style={{ marginVertical: 20 }} />

          <Text style={styles.sectionTitle}>☁️ Content Ownership</Text>
          <Text style={styles.text}>
            Any reflections, moods, journals, or entries you create within Vira are yours. We do not claim ownership of your personal content.
          </Text>

          <Divider style={{ marginVertical: 20 }} />

          <Text style={styles.sectionTitle}>🛠 Updates and Changes</Text>
          <Text style={styles.text}>
            We may update Vira from time to time to improve your experience. Continued use of the app after updates means you accept any new features or changes.
          </Text>

          <Divider style={{ marginVertical: 20 }} />

          <Text style={styles.sectionTitle}>⚖️ Disclaimer</Text>
          <Text style={styles.text}>
            Vira is a self-help tool, not a substitute for professional medical or mental health advice. If you are in crisis or need professional help, please seek support from qualified providers.
          </Text>

          <Divider style={{ marginVertical: 20 }} />

          <Text style={styles.sectionTitle}>📩 Contact Us</Text>
          <Text style={[styles.text, { marginBottom: 50 }]}>
            If you have any questions about these Terms, reach out to us anytime at support@vira-app.com. We're here to support you!
          </Text>

        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fef7fa",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Main-font",
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
});
