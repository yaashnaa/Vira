import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList, SafeAreaView,
} from "react-native";
import { Button, Chip, Divider } from "react-native-paper";
import { db, auth } from "@/config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

interface JournalEntryProps {
  onSave: (entry: any) => void;
  onCancel: () => void;
}
interface JournalEntry {
  id: string;
  title: string;
  body: string;
  tags: string[];
  sleepDuration: string;
  bedtime: string;
  wakeTime: string;
  quality: string;
  timestamp: Date;
}

export default function JournalEntry({ onSave, onCancel }: JournalEntryProps) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [sleepDuration, setSleepDuration] = useState<string>("");
  const [bedtime, setBedtime] = useState<string>("");
  const [wakeTime, setWakeTime] = useState<string>("");
  const [quality, setQuality] = useState<string>("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const allTags: string[] = [
    "grateful",
    "dream",
    "reflection",
    "goal",
    "anxious",
  ];

  useEffect(() => {
    fetchEntries();
  }, []);
  
  const fetchEntries = async (): Promise<void> => {
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
    })) as JournalEntry[];
    setEntries(data);
  };

  const handleSave = async (): Promise<void> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const entry: Omit<JournalEntry, "id"> = {
      title,
      body,
      tags,
      sleepDuration,
      bedtime,
      wakeTime,
      quality,
      timestamp: new Date(),
    };

    await addDoc(collection(db, "users", userId, "journalEntries"), entry);

    setTitle("");
    setBody("");
    setTags([]);
    setSleepDuration("");
    setBedtime("");
    setWakeTime("");
    setQuality("");

    fetchEntries();
  };

  return (
    <SafeAreaView>
           <View style={styles.container}>
      <Text style={styles.heading}>Journal Entry</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Write your thoughts..."
        value={body}
        onChangeText={setBody}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Text style={styles.label}>Tags</Text>
      <View style={styles.chipContainer}>
        {allTags.map((tag) => (
          <Chip
            key={tag}
            selected={tags.includes(tag)}
            onPress={() =>
              setTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              )
            }
            style={styles.chip}
          >
            {tag}
          </Chip>
        ))}
      </View>

      <Text style={styles.label}>Sleep Log</Text>
      <TextInput
        placeholder="Duration (e.g. 7.5 hours)"
        value={sleepDuration}
        onChangeText={setSleepDuration}
        style={styles.input}
      />
      <TextInput
        placeholder="Bedtime (e.g. 10:30 PM)"
        value={bedtime}
        onChangeText={setBedtime}
        style={styles.input}
      />
      <TextInput
        placeholder="Wake time (e.g. 6:00 AM)"
        value={wakeTime}
        onChangeText={setWakeTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Sleep quality (e.g. Good, Poor)"
        value={quality}
        onChangeText={setQuality}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save Entry
      </Button>

      <Button onPress={onCancel}> Cancel </Button>

      <Divider style={{ marginVertical: 20 }} />

      <Text style={styles.heading}>Previous Entries</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryBody}>{item.body}</Text>
            <Text style={styles.entryMeta}>
              Tags: {item.tags?.join(", ")} | Sleep: {item.sleepDuration} (
              {item.quality})
            </Text>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
 
  );
}
const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: "#f8f6f4",
    },
    heading:{
        fontSize: 24,
        textAlign: "center",
    },
    greeting: {
      fontSize: 26,
      fontFamily: "PatrickHand-Regular",
      color: "#622f00",
      marginBottom: 10,
    },
    subheading: {
      fontSize: 18,
      fontFamily: "Main-font",
      marginBottom: 16,
      color: "#c13e6a",
    },
    card: {
      backgroundColor: "#fff",
      marginBottom: 24,
      borderRadius: 12,
      padding: 12,
      elevation: 3,
    },
    label: {
      fontSize: 16,
      fontFamily: "Main-font",
      marginTop: 10,
      color: "#333",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      marginTop: 6,
      backgroundColor: "#fafafa",
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: 10,
    },
    button: {
      marginTop: 20,
      backgroundColor: "#c13e6a",
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    entryButton: {
      padding: 12,
      backgroundColor: "#ebdaf6",
      borderRadius: 8,
    },
    entryButtonText: {
      fontFamily: "Main-font",
      fontSize: 16,
      color: "#5A3E9B",
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
      color: "#333",
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
    chip: {
      margin: 4,
      backgroundColor: "#e0e0e0",
    },
  });   