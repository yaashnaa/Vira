import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import { Button } from "react-native-paper";
import axios from "axios";
import Constants from "expo-constants";
import Collapsible from "react-native-collapsible";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY;

export default function ThoughtReframeChatbotScreen() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "What’s a thought you’d like to work on together?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<any>(null); // Allow scrollToEnd without TS error
  const [autoScroll, setAutoScroll] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const docRef = doc(
        db,
        "users",
        userId,
        "thoughtReframeChats",
        "currentChat"
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(
          data.messages || [
            {
              role: "ai",
              content: "What’s a thought you’d like to work on together?",
            },
          ]
        );
      }
    };

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);
    setAutoScroll(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: `
                        You are a gentle, supportive chatbot helping users reframe unhelpful thoughts using CBT (Cognitive Behavioral Therapy) techniques.
            Always validate the user's feelings first before offering thoughtful reframes.
            You are not a therapist, but you can provide helpful suggestions and reframes.
            Your goal is to help the user feel heard and supported.
            Keep your answers short and to the point.
            Focus only on the user's thought that is provided.
            Do not answer unrelated questions or engage in off-topic conversation.

            User's Thought: ${userInput}

            Please validate their emotion about this thought first, and then gently help them find a healthier or more balanced way to look at it.


              `,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      const botReply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I'm not sure how to respond.";

      const updatedMessages = [
        ...newMessages,
        { role: "ai", content: botReply },
      ];
      setMessages(updatedMessages);

      const userId = auth.currentUser?.uid;
      if (userId) {
        await setDoc(
          doc(db, "users", userId, "thoughtReframeChats", "currentChat"),
          {
            messages: updatedMessages,
            timestamp: new Date(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "ai", content: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 230 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style ={styles.container}>
          <KeyboardAwareFlatList
            ref={flatListRef}
            data={messages}
            keyboardShouldPersistTaps="handled" 
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.role === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text
                  style={{
                    color: item.role === "user" ? "#fff" : "#333",
                    fontSize: 15,
                  }}
                >
                  {item.content}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 0, paddingTop: 10 }}
            onScrollBeginDrag={() => setAutoScroll(false)}
            extraScrollHeight={100}
            enableAutomaticScroll
          />

          {!autoScroll && (
            <TouchableOpacity
              style={styles.scrollToBottomButton}
              onPress={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
                setAutoScroll(true);
              }}
            >
              <Text style={{ color: "#fff" }}>↓ Scroll to latest</Text>
            </TouchableOpacity>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Type here..."
              value={userInput}
              onChangeText={setUserInput}
              style={styles.input}
              multiline
              editable={!loading}
            />
            <Button
              onPress={handleSend}
              mode="contained"
              style={styles.sendButton}
              textColor="#fff"
              disabled={loading}
            >
              Send
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#b488d0",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#f3f0f9",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#b488d0",
    borderRadius: 25,
    justifyContent: "center",
  },
  scrollToBottomButton: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "#b488d0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 5,
  },
});
