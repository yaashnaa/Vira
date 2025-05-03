import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from "react-native";
import { Card, Button, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, db } from "@/config/firebaseConfig";
import {
  collection,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import dayjs from "dayjs";

export default function TodaysMovementCard() {
  const [todayLogs, setTodayLogs] = useState<{ id: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTodayExercise = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const today = dayjs().format("YYYY-MM-DD");

    try {
      const logsRef = collection(db, "users", user.uid, "exerciseLogs");
      const snapshot = await getDocs(logsRef);

      const todaysLogs = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((log: any) => {
          const logDate = dayjs((log.timestamp as Timestamp).toDate()).format("YYYY-MM-DD");
          return logDate === today;
        });

      const parsed = todaysLogs.map((log: any) => ({
        id: log.id,
        description: log.description || "Movement logged.",
      }));

      setTodayLogs(parsed);
    } catch (err) {
      console.error("🔥 Error fetching exercise log:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (logId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "exerciseLogs", logId));
      setTodayLogs((prev) => prev.filter((log) => log.id !== logId));
    } catch (err) {
      console.error("🔥 Error deleting log:", err);
    }
  };

  useEffect(() => {
    fetchTodayExercise();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginVertical: 10 }} />;

  return (
    <Card style={styles.card}>
      <Card.Title
        title="Today's Movement"
        titleStyle={styles.title}
        subtitle={todayLogs.length > 0 ? "You're doing great!" : "Let’s get moving 💪"}
        subtitleStyle={styles.subtitle}
      />
      <Card.Content>
        {todayLogs.map((log) => (
          <View key={log.id} style={styles.row}>
            <Text style={styles.text}>• {log.description}</Text>
            <IconButton
              icon="delete"
              iconColor="#2b1202"
              size={18}
              onPress={() =>
                Alert.alert("Delete Log", "Delete this movement entry?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteLog(log.id),
                  },
                ])
              }
            />
          </View>
        ))}
        {todayLogs.length === 0 && (
          <Text style={styles.text}>No movement logged today yet.</Text>
        )}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Text style={{textAlign: "center", fontFamily: "Main-font", fontSize: 16, margin:"auto", color: "#49206b", marginTop: 20}}>
          {todayLogs.length > 0 ? "Your body appreciates every kind move you make." : "Keep moving, every step counts!"}
        </Text>
      </Card.Actions>
    </Card>
  );
}
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height; 
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    // height: height * 0.7,
    // width: width * 0.91,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "PatrickHand-Regular",
    color: "#271949",
  },
  subtitle: {
    fontFamily: "Main-font",
    fontSize: 14,
    color: "#7e5a9b",
  },
  text: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Main-font",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    justifyContent: "flex-end",
  },
});
