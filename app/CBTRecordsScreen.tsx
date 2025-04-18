import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { Card, Divider } from "react-native-paper";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import Header from "@/components/header";
import dayjs from "dayjs";

export default function ViewCBTRecordsScreen() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "users", uid, "cbtThoughtRecords"),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecords(data);
      setLoading(false);
    };

    fetchRecords();
  }, []);

  return (
    <>
      <Header title="My Thought Records" backPath="/dashboard" />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#622f00" />
        ) : records.length === 0 ? (
          <Text style={styles.emptyText}>No thought records found.</Text>
        ) : (
          records.map((record) => (
            <Card key={record.id} style={styles.card}>
              <Card.Title
                title={`Recorded on ${dayjs(record.timestamp.toDate()).format(
                  "MMMM D, YYYY"
                )}`}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                <Text style={styles.label}>Situation:</Text>
                <Text style={styles.content}>{record.situation}</Text>

                <Divider style={styles.divider} />

                <Text style={styles.label}>Thoughts:</Text>
                <Text style={styles.content}>{record.thoughts}</Text>

                <Text style={styles.label}>Emotions:</Text>
                <Text style={styles.content}>{record.emotions}</Text>

                <Text style={styles.label}>Cognitive Distortions:</Text>
                <Text style={styles.content}>{record.distortions}</Text>

                <Text style={styles.label}>Adaptive Response:</Text>
                <Text style={styles.content}>{record.response}</Text>

                <Text style={styles.label}>Outcome:</Text>
                <Text style={styles.content}>{record.outcome}</Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff8f0",
  },
  card: {
    backgroundColor: "#fefefe",
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 10,
  },
  cardTitle: {
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    fontSize: 20,
  },
  label: {
    fontFamily: "Main-font",
    fontWeight: "600",
    color: "#271949",
    marginTop: 10,
  },
  content: {
    fontFamily: "Main-font",
    color: "#444",
    marginBottom: 4,
  },
  divider: {
    marginVertical: 6,
  },
  emptyText: {
    fontFamily: "Main-font",
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },
});
