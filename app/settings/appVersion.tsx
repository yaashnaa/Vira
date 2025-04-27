import React from "react";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";
import Constants from "expo-constants";
import * as Application from "expo-application";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
import { useRouter } from "expo-router";
export default function AppVersionScreen() {
  const appVersion = Application.nativeApplicationVersion || "Unknown";
  const buildNumber = Application.nativeBuildVersion || "Unknown";
    const router = useRouter();
  const handleCheckUpdates = () => {
    Alert.alert(
      "Check for Updates",
      "In the future, this will let you check for updates or redirect to the app store."
    );
  };

  return (
    <>
      <Header title="App Version" backPath="/settings"/>
      <View style={styles.container}>
        {/* <Text style={styles.header}>📱 App Version</Text> */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Version:</Text>
            <Text style={styles.value}>{appVersion}</Text>

            <Text style={styles.label}>Build:</Text>
            <Text style={styles.value}>{buildNumber}</Text>

            <Text style={styles.note}>
              You're running the latest experience of Vira. 💜
            </Text>

            <Button
              mode="contained"
              onPress={handleCheckUpdates}
              style={styles.button}
              icon="update"
              labelStyle={{ color: "#3e2a6e" }}
            >
              Check for Updates
            </Button>
          </Card.Content>
        </Card>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff0f6",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontFamily: "PatrickHand-Regular",
    marginBottom: 24,
    color: "#3e2a6e",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#3e2a6e",
  },
  value: {
    fontSize: 16,
    color: "#4d3a73",
    fontFamily: "Main-font",
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    fontStyle: "italic",
    color: "#6b5d7d",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#ddceff",
  },
});
