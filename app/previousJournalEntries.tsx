import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";

import { useRouter } from "expo-router";

import { auth, db } from "@/config/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Header from "@/components/header";
const moodLabels: { [key: number]: string } = {
  0: "😞 Very Low",
  25: "😔 Low",
  50: "😐 Neutral",
  75: "🙂 Good",
  100: "😄 Very Good",
};

export default function PreviousJournalEntries() {
  const [entries, setEntries] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(
        collection(db, "users", userId, "journalEntries"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(data);
    };

    fetchEntries();
  }, []);
  const handleBackPress = () => {
    router.replace("/journal");
  };
  return (
    <>
      <Header title="Previous Journal Entries" backPath="/journal"/>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Previous Entries</Text>
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.entryCard}>
                <Text style={styles.entryTitle}>
                  {item.entryType === "prompt"
                    ? "🧠 Prompt-Based Entry"
                    : item.entryType === "mood"
                      ? "💬 Mood-Based Entry"
                      : "✍️ Free Write"}
                </Text>
                {item.prompt && (
                  <Text style={styles.entryMeta}>
                    <Text style={{ fontWeight: "bold" }}>Prompt:</Text>{" "}
                    {item.prompt}
                  </Text>
                )}
                <Text style={styles.entryBody}>{item.entryText}</Text>
            

                <Text style={styles.entryMeta}>
                  <Text style={{ fontWeight: "bold" }}>Date: </Text>

                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f6f4",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    color: "#271949",
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  entryTitle: {
    fontSize: 14,
    fontFamily: "PatrickHand-Regular",
    // fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  entryBody: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  entryMeta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});
