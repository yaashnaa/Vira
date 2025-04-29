import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Card, Icon, Portal, Modal } from "react-native-paper";
import Toast from "react-native-toast-message";
import { db, auth } from "@/config/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import ThoughtReframeHistory from "./history";

export default function ManualThoughtReframeScreen() {
  const [originalThought, setOriginalThought] = useState("");
  const [supportingEvidence, setSupportingEvidence] = useState("");
  const [contraryEvidence, setContraryEvidence] = useState("");
  const [reframedThought, setReframedThought] = useState("");
  const [historyVisible, setHistoryVisible] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(db, "users", userId, "thoughtReframes"), {
        originalThought,
        supportingEvidence,
        contraryEvidence,
        reframedThought,
        timestamp: new Date(),
      });

      setOriginalThought("");
      setSupportingEvidence("");
      setContraryEvidence("");
      setReframedThought("");
      Toast.show({
        type: "success",
        text1: "✨ Thought Reframe saved!",
        text2: "Your reframed thought has been recorded 💖",
        position: "bottom",
      });

    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error saving reframe",
        text2: "Please try again later.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        enableAutomaticScroll
        extraScrollHeight={Platform.OS === "ios" ? 80 : 40}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => setHistoryVisible(true)}
          style={styles.historyButton}
        >
          <Text>View Thought Reframe History</Text>
          <Icon source="history" size={24} color="#8652e0" />
        </TouchableOpacity>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>
              1. What’s the thought or belief bothering you?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              value={originalThought}
              onChangeText={setOriginalThought}
              placeholder="e.g. I don't feel like I'm doing enough."
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>
              2. What evidence supports this thought?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              value={supportingEvidence}
              onChangeText={setSupportingEvidence}
              placeholder="e.g. I missed some deadlines, but..."
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>
              3. What evidence challenges this thought?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              value={contraryEvidence}
              onChangeText={setContraryEvidence}
              placeholder="e.g. I’ve also met important goals."
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>
              4. Reframe into something kinder or more balanced.
            </Text>
            <TextInput
              style={styles.input}
              multiline
              value={reframedThought}
              onChangeText={setReframedThought}
              placeholder="e.g. I'm trying my best, and that's okay."
              placeholderTextColor="#999"
            />

            <Button
              mode="contained"
              icon="check"
              onPress={handleSave}
              style={styles.button}
            >
              Save Reframe
            </Button>
          </Card.Content>
        </Card>

        {/* History Modal */}
        <Portal>
          <Modal
            visible={historyVisible}
            onDismiss={() => setHistoryVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.historyTitle}>Your Thought Reframes</Text>
            <ThoughtReframeHistory />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setHistoryVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#622f00",
  },
  card: {
    backgroundColor: "#f8f6f4",
    borderRadius: 12,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    margin: "auto",
    marginBottom: 25,
  },
  headerText: {
    color: "#622f00",
    fontWeight: "600",
    fontSize: 19,
    fontFamily: "patrickHand-regular",
  },
  historyButton: {
    marginLeft: 10,
    backgroundColor: "#f2e8ff",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  content: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontFamily: "Main-font",
  },
  link: {
    color: "#8652e0",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Main-font",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginTop: 8,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#9f83ce",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PatrickHand-Regular",
    color: "#6b4c9a",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#d2c2ed",
    padding: 10,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "#4b2b82",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 80, 
    borderRadius: 20,
  },
});
