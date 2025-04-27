import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { db, auth } from "@/config/firebaseConfig";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import dayjs from "dayjs";

export default function ThoughtReframeHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "users", uid, "thoughtReframes"),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      const reframes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(reframes);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6b4c9a" style={{ marginTop: 30 }} />;
  }

  if (history.length === 0) {
    return <Text style={styles.noData}>No thought reframes found yet.</Text>;
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => (
        <Card style={styles.card} mode="contained">
          <Card.Content>
            <Text style={styles.date}>{dayjs(item.timestamp.toDate()).format("MMMM D, YYYY")}</Text>

            <Text style={styles.label}>Original Thought:</Text>
            <Text style={styles.text}>{item.originalThought}</Text>

            <Text style={styles.label}>Supporting Evidence:</Text>
            <Text style={styles.text}>{item.supportingEvidence}</Text>

            <Text style={styles.label}>Contrary Evidence:</Text>
            <Text style={styles.text}>{item.contraryEvidence}</Text>

            <Text style={styles.label}>Reframed Thought:</Text>
            <Text style={[styles.text, { fontWeight: "bold", color: "#4b2b82" }]}>
              {item.reframedThought}
            </Text>
          </Card.Content>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f7f3ff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  date: {
    fontSize: 12,
    color: "#777",
    textAlign: "right",
    marginBottom: 6,
    fontFamily: "Main-font",
  },
  label: {
    fontSize: 14,
    color: "#6b4c9a",
    fontWeight: "600",
    marginTop: 8,
    fontFamily: "Main-font",
  },
  text: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Main-font",
    marginTop: 4,
  },
  noData: {
    fontSize: 16,
    color: "#777",
    marginTop: 30,
    textAlign: "center",
    fontFamily: "Main-font",
  },
});
