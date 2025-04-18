import React, { useState, useRef,  useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { db, auth } from "@/config/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  Modal,
  Portal,
  Button,
  Provider,
  SegmentedButtons,
} from "react-native-paper";
import { useRouter } from "expo-router";
import JournalEntry from "@/components/Journal/journalEntry";
import { useUserPreferences } from "@/context/userPreferences";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useMoodContext } from "@/context/moodContext";
import dayjs from "dayjs";
import MoodTagSuggestions from "@/components/Journal/moodTagSuggestions";
import CBTJournalingInfo from "@/components/Journal/CBTInfo";
import JournalEntrySection from "@/components/Journal/JournalEntrySection";
import CBTPromptSelector from "@/components/Journal/CBTPromptSelector";
import LottieView from "lottie-react-native";

export default function CheckInScreen() {
  const { userPreferences } = useUserPreferences();
  const { mood, hasLoggedToday } = useMoodContext();
  const today = dayjs().format("YYYY-MM-DD");
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const scrollToInput = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300); // give time for keyboard to appear
  };
  const [isNewEntryVisible, setIsNewEntryVisible] = useState(false);
  const [entries, setEntries] = useState<{ id: string; [key: string]: any }[]>(
    []
  );
  const [entryType, setEntryType] = useState("free"); // free, prompt, mood
  const shouldShowMoodOption = userPreferences?.moodcCheckInBool;

  const entryOptions = [
    { value: "free", label: "Free Write" },
    { value: "prompt", label: "Prompt-Based" },
  ];

  if (shouldShowMoodOption) {
    entryOptions.push({ value: "mood", label: "Mood-Based" });
  }

  const fetchEntries = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(
        collection(db, "users", userId, "journalEntries"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleBackPress = () => {
    router.replace("/dashboard");
  };

  const renderEntryExtras = () => {
    if (entryType === "mood") {
      return <MoodTagSuggestions mood={mood ?? 2} />;
    }
    if (entryType === "prompt") {
      return (
        <>
          <CBTJournalingInfo />
          <CBTPromptSelector />
        </>
      );
    }
    return null;
  };

  return (
    <>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb",
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#271949" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "JOURNAL",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => router.replace("/settings")}
            >
              <Icon name="settings" size={25} type="feather" color="#271949" />
            </TouchableOpacity>
          </View>
        }
      />

      <Provider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}   ref={scrollRef}>
              <Text style={styles.heading}>
                Hi {userPreferences?.name || "there"} ✨
              </Text>
              <LottieView
                source={require("../assets/animations/write.json")}
                autoPlay
                loop
                style={{
                  width: 150,
                  height: 150,
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              />
              <Text style={styles.sectionTitle}>
                What kind of journaling today?
              </Text>
              <SegmentedButtons
                value={entryType}
                onValueChange={setEntryType}
                buttons={entryOptions}
              />
              <Text style={styles.modeDescription}>
                {entryType === "free" &&
                  "Write freely about anything on your mind."}
                {entryType === "prompt" &&
                  "Answer structured CBT prompts to guide reflection."}
                {entryType === "mood" &&
                  "Get suggestions based on how you're feeling today."}
              </Text>

              {/* Conditional: If mood mode selected but no check-in */}
              {entryType === "mood" && !hasLoggedToday ? (
                <View style={styles.checkInNotice}>
                  <Text style={styles.noticeText}>
                    You haven't checked in today. Please do a mood check-in
                    first!
                  </Text>
                  <Button
                    onPress={() => router.push("/checkInScreen")}
                    mode="outlined"
                    style={{ marginTop: 8 }}
                  >
                    Go to Check-In
                  </Button>
                </View>
              ) : (
                <>
                  {renderEntryExtras()}
                  <JournalEntrySection onFocus={scrollToInput} />

                </>
              )}

              <Text style={styles.heading}>Your Journal</Text>
              <View style={styles.buttons}>
                <Button
                  mode="contained"
                  onPress={() => setIsNewEntryVisible(true)}
                  compact={true}
                  icon={"plus"}
                  style={styles.actionButton}
                >
                  New Entry
                </Button>
                <Button
                  mode="contained"
                  compact={true}
                  icon={"link-variant"}
                  onPress={() => router.replace("/previousJournalEntries")}
                  style={styles.actionButton}
                >
                  View previous entries
                </Button>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <Portal>
          <Modal
            visible={isNewEntryVisible}
            onDismiss={() => setIsNewEntryVisible(false)}
            contentContainerStyle={styles.modal}
          >
            <JournalEntry
              onSave={() => setIsNewEntryVisible(false)}
              onCancel={() => setIsNewEntryVisible(false)}
            />
          </Modal>
        </Portal>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 16,
    fontFamily: "PatrickHand-Regular",
    color: "#622f00",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3e2a6e",
    marginBottom: 10,
    fontFamily: "Main-font",
  },
  actionButton: {
    padding: 5,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    height: "105%",
  },
  headerRight: {
    flexDirection: "row",
    marginTop: 5,
  },
  modeDescription: {
    fontSize: 14,
    color: "#94618e",
    marginVertical: 10,
  },
  checkInNotice: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff4f4",
    borderWidth: 1,
    borderColor: "#fbb",
    alignItems: "center",
  },
  noticeText: {
    color: "#aa0000",
    fontSize: 14,
    fontFamily: "Main-font",
    textAlign: "center",
  },
});
