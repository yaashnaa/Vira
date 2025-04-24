import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,

  SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { auth, db } from "@/config/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getJournalEntries } from "@/utils/journalHelper";
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
}
  return (
    <View style={{ flex: 1 }}>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb",
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#271949" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "My Journal",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
      />
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
                  <Text style={{ fontWeight: "bold" }}>Prompt:</Text> {item.prompt}
                </Text>
              )}
              <Text style={styles.entryBody}>{item.entryText}</Text>
              {item.mood && (
                <Text style={styles.entryMeta}>
                  <Text style={{ fontWeight: "bold" }}>Mood:</Text> {item.mood}
                </Text>
              )}
              <Text style={styles.entryMeta}>
                <Text style={{ fontWeight: "bold" }}>Date:</Text> {item.date}
              </Text>
            </View>
          )}
          
        />
      </View>
    </View>
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
