import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,Dimensions
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import Header from "@/components/header";
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
    <Header title="Feedback" backPath="/settings"/>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.header}>💌 We’d love your feedback</Text>
          <Text style={styles.subtext}>
            Whether it's a kind word, a suggestion, or something that felt off —
            your voice helps us grow.
          </Text>
          <View style={styles.dropdownContainer}>
            <Menu
              visible={menuVisible}
              contentStyle={styles.dropdown}
        
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <Text style={styles.dropdownText}>{category}</Text>
                  <AntDesign name="down" size={20} color="black" />
                </TouchableOpacity>
              }
            >
              {categories.map((item) => (
                <Menu.Item
                  key={item}
                  titleStyle={{ color: '#6b4c9a', fontSize: 14 }}
                  onPress={() => {
                    setCategory(item);
                    setMenuVisible(false);
                  }}
                  title={item}
                />
              ))}
            </Menu>
          </View>

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
          <Button textColor="#250808" onPress={() => router.back()} style={styles.backButton}>
            Back to Settings
          </Button>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
const { width } = Dimensions.get("window");
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
    color: "#271949",
    marginTop: 55,
    width: width *0.9,
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
    color: "#271949",
    marginBottom: 120,
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
    color: "#09090a",
  },

  dropdownArrow: {
    fontSize: 18,
    color: "#271949",
  },
});
