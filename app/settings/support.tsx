import React from "react";
import { View, Text, StyleSheet, Linking, ScrollView } from "react-native";
import { Card, Button } from "react-native-paper";
import Header from "@/components/header";
import { useRouter } from "expo-router";

export default function SupportScreen() {
    const router = useRouter();
    const handleEmailSupport = () => {
        const email = "yaashna.gupta@nyu.edu"; 
        const subject = "Need help with the app";
        const body = "Hi Vira Team,\n\nI need help with...";
      
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        Linking.openURL(url).catch((err) => {
          console.error("Failed to open mail app:", err);
          alert("Could not open your mail app. Please try manually emailing us.");
        });
      };
      

  const handleVisitFAQ = () => {
    router.push("/settings/faq");
  };

  const handleEmergencyHelp = () => {
    Linking.openURL("https://www.opencounseling.com/suicide-hotlines"); // replace with your actual resource
  };

  return (
    <>
      <Header title="Need Support?" backPath="/settings"/>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.introText}>
          If you're feeling overwhelmed, confused, or need help with the app,
          we're here for you. 💛
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📧 Contact Us</Text>
            <Text style={styles.description}>
              Reach out to the Vira team — we’re happy to help with technical
              issues, account support, or feedback.
            </Text>
            <Button onPress={handleEmailSupport} style={styles.button} mode="contained">
              Email Support
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🔍 Explore FAQs</Text>
            <Text style={styles.description}>
              Have questions? Our FAQ page might already have what you're
              looking for.
            </Text>
            <Button onPress={handleVisitFAQ} style={styles.button} mode="contained">
              View FAQs
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🆘 Crisis or Mental Health Help</Text>
            <Text style={styles.description}>
              If you or someone you know is in crisis, please reach out to a
              mental health professional or hotline in your area. You're not
              alone.
            </Text>
            <Button onPress={handleEmergencyHelp} style={styles.button} textColor="black" mode="outlined">
              Emergency Resources
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#F8EDEB",
    },
    container: {
      padding: 20,
      backgroundColor: "#F8EDEB",
    },
    introText: {
      fontSize: 16,
      fontStyle: "italic",
      fontFamily: "Main-font",
      color: "#5e4a7d",
      marginBottom: 20,
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "PatrickHand-Regular",
      color: "#3e2a6e",
      marginBottom: 6,
    },
    description: {
      fontSize: 14,
      fontFamily: "Main-font",
      color: "#5e4a7d",
      marginBottom: 12,
    },
    button: {
      alignSelf: "flex-start",
      backgroundColor: "#ddceff",
    },
  });
  