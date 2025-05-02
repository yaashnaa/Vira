import React, { ReactNode, useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export const OfflineWrapper = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch("https://clients3.google.com/generate_204");
        setIsOffline(false);
      } catch (error) {
        setIsOffline(true);
      }
    };

    checkConnection(); // Check immediately on mount

    const interval = setInterval(checkConnection, 5000); // Then every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (isOffline) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🔌 You're offline.</Text>
        <Text style={styles.subtext}>
          Please connect to the internet to continue enjoying Vira's features 💜
        </Text>

        <ActivityIndicator
          size="large"
          color="#888"
          style={{ marginTop: 10 }}
        />
        <Text style={styles.subtext}>Trying to reconnect...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
