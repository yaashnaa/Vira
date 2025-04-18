import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
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
import LottieView from "lottie-react-native";

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
    "wins",
    "dream",
    "reflection",
    "goal",
    "overthinking",
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
        <LottieView
          source={require("../../assets/animations/write.json")}
          autoPlay
          loop
          style={{
            width: 150,
            height: 150,
            alignSelf: "center",
            marginBottom: 10,
          }}
        />

        <Text style={styles.heading}>New Entry</Text>
        <TextInput
          placeholder="Title"
          placeholderTextColor={"#afafaf"}
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Write your thoughts..."
          placeholderTextColor={"#afafaf"}
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
              elevated={true}
              compact={true}
              selectedColor="#6B46C1"
              // selectedColor="#c0a8d6"
              style={[styles.chip, { backgroundColor: "#ebd9fc" }]}
              textStyle={{
                fontFamily: "Main-font",
                color: "#180c00",
                textTransform: "capitalize",
              }}
              selected={tags.includes(tag)}
              onPress={() =>
                setTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
            >
              {tag}
            </Chip>
          ))}
        </View>
        <View style={styles.buttons}>
          <Button
            onPress={handleSave}
            style={styles.button}
            mode="outlined"
            icon="check"
            textColor="#580b88"
          >
            Save Entry
          </Button>
        </View>
        <Button onPress={onCancel} textColor="#773434" style={{width: 100, margin:"auto"}}> Cancel </Button>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 28,
    fontFamily: "PatrickHand-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontFamily: "PatrickHand-Regular",
    color: "#622f00",
    marginBottom: 10,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  subheading: {
    fontSize: 18,
    fontFamily: "Main-font",
    marginBottom: 16,
    color: "#622f00",
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
    width: "100%",
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    // margin: "auto",
    width: "50%",
    fontSize: 16,
    backgroundColor: "#ffffff",
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

    textAlign: "center",
    backgroundColor: "#e0e0e0",
  },
});
