import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const categories = ["Suggestion", "Bug", "Kind Words", "Other"];

export default function FeedbackScreen() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState<string>("Suggestion");
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert("Oops!", "Please write a message before submitting.");
      return;
    }

    try {
      const uid = auth.currentUser?.uid || "anonymous";
      const feedbackRef = doc(db, "feedback", `${uid}_${Date.now()}`);
      await setDoc(feedbackRef, {
        message: feedback.trim(),
        category,
        createdAt: Timestamp.now(),
        uid,
      });

      Alert.alert("Thank you!", "Your thoughts help us improve Vira 🌿");
      setFeedback("");
      setCategory("Suggestion");
      router.back();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <HeaderRNE
        containerStyle={{ backgroundColor: "#f8edeb", borderBottomWidth: 0 }}
        leftComponent={
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" type="ionicon" color="#190028" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "EDIT PROFILE",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
      />

      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>💌 We’d love your feedback</Text>
        <Text style={styles.subtext}>
          Whether it's a kind word, a suggestion, or something that felt off —
          your voice helps us grow.
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dropdownContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <Text style={styles.dropdownText}>{category}</Text>
                  <Icon name="chevron-down" size={20} color="#271949" />
                </TouchableOpacity>
              }
            >
              {categories.map((item) => (
                <Menu.Item
                  key={item}
                  onPress={() => {
                    setCategory(item);
                    setMenuVisible(false);
                  }}
                  title={item}
                />
              ))}
            </Menu>
          </View>
        </TouchableWithoutFeedback>
        <TextInput
          style={styles.input}
          placeholder="Type your thoughts here..."
          multiline
          placeholderTextColor="#999"
          value={feedback}
          onChangeText={setFeedback}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          textColor="#271949"
        >
          Submit Feedback
        </Button>
        <Button onPress={() => router.back()} style={styles.backButton}>
          Back to Settings
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8EDEB",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 10,
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 140,
    textAlignVertical: "top",
    fontFamily: "Main-font",
    fontSize: 14,
    color: "#333",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ddceff",
    borderRadius: 10,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 12,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  dropdownText: {
    fontFamily: "Main-font",
    fontSize: 16,
    color: "#271949",
  },

  dropdownArrow: {
    fontSize: 18,
    color: "#271949",
  },
});
