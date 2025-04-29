import React from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function ReflectionCard() {
  const router = useRouter();

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Reflection"
        subtitle="Write down your thoughts"
        titleStyle={styles.title}
        subtitleStyle={{ color: "#622f00" }}
      />
      <Card.Content>
        <Text style={styles.text}>
          Journaling helps process emotions and track growth.
        </Text>
        <Button
          onPress={() => router.push("/journal")}
          mode="contained-tonal"
          style={styles.button}
          textColor="#622f00"
        >
          Go to Journal
        </Button>
      </Card.Content>
    </Card>
  );
}

const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: "#f8edeb",
    borderRadius: 10,
    padding: 5,
    width: "48%",
    height: height * 0.25,
  },
  title: {
    fontSize: 20,
    color: "#622f00",
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
    fontFamily: "Main-font",
    color: "#333",
  },
  button: {
    backgroundColor: "#DBE7E4",
    marginTop: 5,
  },
});
