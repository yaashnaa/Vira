import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Divider, Card } from "react-native-paper";
import { db, auth } from "@/config/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import dayjs from "dayjs";

interface JournalEntrySectionProps {
  moodLabel?: string;
  selectedPrompt?: string;
  onSave?: () => void;
  onFocus?: () => void;
}

export default function JournalEntrySection( {
  moodLabel,
  selectedPrompt,
  onSave,
  onFocus
}: JournalEntrySectionProps) {
  const [entryText, setEntryText] = useState("");

  const today = dayjs().format("YYYY-MM-DD");

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(db, "users", userId, "journalEntries"), {
        entryText,
        mood: moodLabel || null,
        date: today,
        prompt: selectedPrompt || null,
        timestamp: new Date(),
      });

      setEntryText("");
      Alert.alert("Saved", "Your journal entry has been saved.");
      onSave?.();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      Alert.alert("Error", "Failed to save entry.");
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        {selectedPrompt && (
          <View style={styles.promptSection}>
            <Text style={styles.promptTitle}>Prompt</Text>
            <Text style={styles.promptText}>{selectedPrompt}</Text>
            <Divider style={styles.divider} />
          </View>
        )}

        <Text style={styles.label}>📝 Write your thoughts here</Text>
        <TextInput
          style={styles.input}
          placeholder="Start writing..."
          placeholderTextColor={"#afafaf"}
          multiline
          value={entryText}
          onChangeText={setEntryText}
          onFocus={onFocus}
        />

        <Button
          mode="contained-tonal"
          icon="check"
          textColor="#580b88"
          onPress={handleSave}
          style={styles.button}
        >
          Save Entry
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fef9f6",
    borderRadius: 12,
    marginBottom: 30,
  },
  promptSection: {
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3e2a6e",
    marginBottom: 4,
    fontFamily: "Main-font",
  },
  promptText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    fontFamily: "Main-font",
  },
  divider: {
    marginVertical: 12,
    height: 1,
    backgroundColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
    fontFamily: "Main-font",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontFamily: "Main-font",
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 16,
    backgroundColor: "#f8f6f4",
    alignSelf: "center",
  },
});
