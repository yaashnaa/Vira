// screens/CBTToolsScreen.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Text, Card, Button, Divider, IconButton } from "react-native-paper";
import Header from "@/components/header";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import CBTExplanationSection from "@/components/CBTExplanation";
import Toast from "react-native-toast-message";
import { Alert } from "react-native"; // at the top
export default function CBTToolsScreen() {
  const router = useRouter();
  const [situation, setSituation] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [emotions, setEmotions] = useState("");
  const [distortions, setDistortions] = useState("");
  const [response, setResponse] = useState("");
  const [outcome, setOutcome] = useState("");
  const [adaptiveResponseHelp, setAdaptiveResponseHelp] = useState(false);
  const [distortionModalVisible, setDistortionModalVisible] = useState(false);

  const handleSave = async () => {
    try {
      if (!situation.trim()) {
        Alert.alert("Missing Information", "Please describe the situation.");
        return;
      }
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(db, "users", userId, "cbtThoughtRecords"), {
        situation,
        thoughts,
        emotions,
        distortions,
        response,
        outcome,
        timestamp: new Date(),
      });

      // Optional: Show success feedback
      Toast.show({
        type: "success",
        text1: "Thought Record Saved!",
      
      });
      

      // Optional: Clear form
      setSituation("");
      setThoughts("");
      setEmotions("");
      setDistortions("");
      setResponse("");
      setOutcome("");
    } catch (error) {
      console.error("Error saving thought record:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Unable to save your check-in 😞",
      });
      
    }
  };

  return (
    <>
      <Header title="CBT Thought Record" backPath="/dashboard" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <CBTExplanationSection />
          <Card style={styles.card}>
            <Card.Title
              title="1. Situation"
              titleStyle={{
                color: "#271949",
                fontFamily: "PatrickHand-Regular",
                fontSize: 22,
              }}
            />
            <Card.Content>
              <TextInput
                style={styles.input} // Adjust text color
                placeholder="Describe what triggered the thought..."
                placeholderTextColor="#8c8c8c"
                multiline
                value={situation}
                onChangeText={setSituation}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title
              title="2. Automatic Thought(s)"
              titleStyle={{
                color: "#271949",
                fontFamily: "PatrickHand-Regular",
                fontSize: 22,
              }}
            />
            <Card.Content>
              <TextInput
                style={styles.input}
                placeholder="What was going through your mind?"
                multiline
                value={thoughts}
                placeholderTextColor="#8c8c8c"
                onChangeText={setThoughts}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title
              title="3. Emotion(s)"
              titleStyle={{
                color: "#271949",
                fontFamily: "PatrickHand-Regular",
                fontSize: 22,
              }}
            />
            <Card.Content>
              <TextInput
                style={styles.input}
                placeholder="What did you feel? (e.g., sad, anxious)"
                multiline
                placeholderTextColor="#8c8c8c"
                value={emotions}
                onChangeText={setEmotions}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title
              title="4. Cognitive Distortions"
              titleStyle={{
                color: "#271949",
                fontFamily: "PatrickHand-Regular",
                fontSize: 22,
              }}
              right={(props) => (
                <IconButton
                  {...props}
                  iconColor="#8d8d8d"
                  icon="help-circle-outline"
                  style={{
                    marginRight: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                  size={26}
                  onPress={() => setDistortionModalVisible(true)}
                />
              )}
            />
            <Card.Content>
              <TextInput
                style={styles.input}
                placeholder="Any thinking traps? (e.g., catastrophizing, mind reading)"
                multiline
                placeholderTextColor="#8c8c8c"
                value={distortions}
                onChangeText={setDistortions}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title
              title="5. Adaptive Response"
              titleStyle={{
                color: "#271949",
                fontFamily: "PatrickHand-Regular",
                fontSize: 22,
              }}
              right={(props) => (
                <IconButton
                  {...props}
                  iconColor="#8d8d8d"
                  icon="help-circle-outline"
                  style={{
                    marginRight: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                  size={26}
                  onPress={() => setAdaptiveResponseHelp(true)}
                />
              )}
            />
            <Card.Content>
              <TextInput
                style={styles.input}
                placeholder="What would you tell a friend in this situation?"
                multiline
                placeholderTextColor="#8c8c8c"
                value={response}
                onChangeText={setResponse}
              />
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title
              title="6. Outcome"
              titleStyle={{
                color: "#271949",
                fontFamily: "PatrickHand-Regular",
                fontSize: 22,
              }}
            />
            <Card.Content>
              <TextInput
                style={styles.input}
                placeholder="How do you feel now?"
                multiline
                placeholderTextColor="#8c8c8c"
                value={outcome}
                onChangeText={setOutcome}
              />
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            textColor="#3a1d04"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Thought Record
          </Button>

          <Divider style={{ marginVertical: 20 }} />
          <Modal
            animationType="slide"
            transparent={true}
            visible={adaptiveResponseHelp}
            onRequestClose={() => setAdaptiveResponseHelp(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  You can use the questions below to compose a response to the
                  automatic thought(s).
                </Text>
                <Text style={styles.modalText}>
                  {"\n"}• What would I say to a friend in this situation?
                  {"\n"}• Is there another way of looking at this?
                  {"\n"}• What evidence do I have for and against this thought?
                  {"\n"}• What’s the bigger picture here?
                  {"\n"}• Am I being too hard on myself?
                  {"\n"}• Could this be a cognitive distortion?
                </Text>
                <Button onPress={() => setAdaptiveResponseHelp(false)}>
                  Close
                </Button>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={distortionModalVisible}
            onRequestClose={() => setDistortionModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Common Cognitive Distortions
                </Text>
                <Text style={styles.modalText}>
                  -
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    All-or-Nothing Thinking:
                  </Text>
                  "If I'm not perfect, I failed."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Catastrophizing:
                  </Text>
                  Expecting the worst-case scenario.
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Overgeneralization:
                  </Text>
                  "Nothing ever goes right."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Mind Reading:
                  </Text>
                  Assuming you know what others think.
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Should Statements:
                  </Text>
                  "I should be better at this."
                  {"\n"}-{" "}
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Labeling:
                  </Text>
                  "I'm a failure."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Magnification:
                  </Text>
                  "This is the worst thing that's ever happened."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Personalization:
                  </Text>
                  "This is all my fault."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Fortune Telling:
                  </Text>
                  "I just know this will go wrong."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Jumping to Conclusions:
                  </Text>
                  "I know what they're thinking."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Disqualifying the Positive:
                  </Text>
                  "That compliment doesn't count."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Mental Filter:
                  </Text>{" "}
                  "I only see the negative."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Discounting the Positive:
                  </Text>
                  "That was just luck."
                  {"\n"}-
                  <Text style={{ color: "#4e4d4d", fontWeight: "bold" }}>
                    Tunnel Vision:
                  </Text>
                  "“My son’s teacher can’t do anything right. He’s critical and
                  insensitive and lousy at teaching.”"
                </Text>
                <Button onPress={() => setDistortionModalVisible(false)}>
                  Close
                </Button>
              </View>
            </View>
          </Modal>
          <Button textColor="#3a1d04" onPress={() => router.push('/CBTRecordsScreen')} style={[styles.button, { marginBottom: 40 }]}> View Previous Records</Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8EDEB",
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    paddingTop: 10,
    backgroundColor: "#fefefe",
  },

  description: {
    marginTop: 8,
    fontFamily: "Main-font",
    color: "#444",
  },
  source: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: "italic",
    color: "#999",
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Main-font",
    color: "#3e2a6e",
  },
  button: {
    // marginTop: 20,
    backgroundColor: "#FAE1DD",
    borderRadius: 10,
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#3e2a6e",
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Main-font",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 10,
    minHeight: 100,
    fontFamily: "Main-font",
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#fae1dd",
    borderRadius: 10,
    paddingVertical: 6,
  },
});
