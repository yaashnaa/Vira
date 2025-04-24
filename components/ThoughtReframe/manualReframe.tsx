import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,

  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,

} from "react-native";
import { Button, Card, Icon } from "react-native-paper";
import Toast from "react-native-toast-message";
import { db, auth } from "@/config/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function ManualThoughtReframeScreen() {
  const [originalThought, setOriginalThought] = useState("");
  const [supportingEvidence, setSupportingEvidence] = useState("");
  const [contraryEvidence, setContraryEvidence] = useState("");
  const [reframedThought, setReframedThought] = useState("");

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
        text2: "Your reframed thought has been safely recorded 💖" ,
        position: "bottom",
      });
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error saving thought reframe:", error);
      Toast.show({
        type: "error",
        text1: "Error saving thought reframe",
        text2: "Please try again later.",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>

          
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.label}>
                1. What's the thought or belief bothering you?
              </Text>
              <TextInput
                style={styles.input}
                multiline
                value={originalThought}
                onChangeText={setOriginalThought}
                placeholder="e.g. I'm always failing."
              />

              <Text style={styles.label}>
                2. What evidence supports this thought?
              </Text>
              <TextInput
                style={styles.input}
                multiline
                value={supportingEvidence}
                onChangeText={setSupportingEvidence}
              />

              <Text style={styles.label}>
                3. What evidence challenges or disagrees with this thought?
              </Text>
              <TextInput
                style={styles.input}
                multiline
                value={contraryEvidence}
                onChangeText={setContraryEvidence}
              />

              <Text style={styles.label}>
                4. Reframe the thought into something more balanced or kind.
              </Text>
              <TextInput
                style={styles.input}
                multiline
                value={reframedThought}
                onChangeText={setReframedThought}
                placeholder="e.g. I'm learning and growing every day."
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    margin:"auto",
    marginBottom: 25,
  },
  headerText: {
    color: "#622f00",
    fontWeight: "600",
    fontSize: 19,
    fontFamily:'patrickHand-regular',
  },
  content: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontFamily:'Main-font',
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
    fontFamily:'Main-font',
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
    backgroundColor: "#d2c2ed",
  },
});
