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
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={styles.entryBody}>{item.body}</Text>
              <Text style={styles.entryMeta}>
                Tags: {item.tags?.join(", ")} 
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  entryBody: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  entryMeta: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});
