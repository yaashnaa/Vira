import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import Collapsible from "react-native-collapsible";
import { auth, db } from "@/config/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import CrisisPlanSection from "@/components/crisisPlanSection";

const copingCategories = [
  {
    key: "selfSoothing",
    title: "Self-Soothing",
    explanation: "Comfort yourself using the five senses...",
  },
  {
    key: "distraction",
    title: "Distraction",
    explanation: "Take your mind off the problem...",
  },
  {
    key: "oppositeAction",
    title: "Opposite Action",
    explanation: "Do something that brings out the opposite emotion...",
  },
  {
    key: "emotionalAwareness",
    title: "Emotional Awareness",
    explanation: "Help yourself recognize and express...",
  },
  {
    key: "mindfulness",
    title: "Mindfulness",
    explanation: "Practice grounding in the present moment...",
  },
];

// ✅ Helper for safe doc reference
function getCopingBoxRef(uid: string) {
  return doc(db, "users", uid, "copingData", "box");
}

export default function MyCopingBoxScreen() {
  const [boxItems, setBoxItems] = useState<Record<string, string[]>>({});
  const [newItemText, setNewItemText] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [explanationsCollapsed, setExplanationsCollapsed] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (auth.currentUser?.uid) {
      fetchBoxItems();
    }
  }, []);

  const fetchBoxItems = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error("User ID is undefined");
      return;
    }

    const docRef = getCopingBoxRef(uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setBoxItems(snapshot.data());
    }
  };

  const toggleExplanation = (title: string) => {
    setExplanationsCollapsed((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleAdd = async (key: string) => {
    const uid = auth.currentUser?.uid;
    if (!newItemText.trim() || !uid) return;

    const docRef = getCopingBoxRef(uid);
    await setDoc(
      docRef,
      { [key]: arrayUnion(newItemText.trim()) },
      { merge: true }
    );

    setNewItemText("");
    fetchBoxItems();
  };

  const handleRemove = async (key: string, item: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const docRef = getCopingBoxRef(uid);
    await updateDoc(docRef, { [key]: arrayRemove(item) });

    fetchBoxItems();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Personal Coping Box</Text>

      {copingCategories.map(({ key, title, explanation }) => (
        <View key={key} style={styles.section}>
          <TouchableOpacity onPress={() => toggleExplanation(key)}>
            <Text style={styles.categoryTitle}>
              {explanationsCollapsed[key] ? "▲" : "▼"} {title}
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={!explanationsCollapsed[key]}>
            <Text style={styles.explanation}>{explanation}</Text>
          </Collapsible>

          {(boxItems[key] || []).map((item, idx) => (
            <Card key={idx} style={styles.itemCard}>
              <Card.Content style={styles.itemRow}>
                <Text style={styles.itemText}>{item}</Text>
                <Button
                  compact
                  icon="delete"
                  onPress={() => handleRemove(key, item)}
                  textColor="#313131"
                  
                >
                  Delete
                  </Button>
              </Card.Content>
            </Card>
          ))}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={`Add something to ${title}`}
              value={activeCategory === key ? newItemText : ""}
              onChangeText={(text) => {
                setActiveCategory(key);
                setNewItemText(text);
              }}
              placeholderTextColor="#999"
            />
            <Button mode="contained" onPress={() => handleAdd(key)}>
              Add
            </Button>
          </View>

          <Divider style={styles.divider} />
        </View>
      ))}

      <View style={{ marginTop: 30 }}>
        <CrisisPlanSection />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff0f6",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 28,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: 22,
    fontFamily: "PatrickHand-Regular",
    color: "#291b52",
    marginBottom: 10,
  },
  explanation: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#5e4a7d",
    backgroundColor: "#fef6fb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    lineHeight: 20,
  },
  itemCard: {
    backgroundColor: "#fbeaff",
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontFamily: "Main-font",
    color: "#3e2a6e",
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Main-font",
    backgroundColor: "#fff",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 20,
  },
});
