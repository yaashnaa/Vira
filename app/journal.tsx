import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform, Dimensions
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
import { useUserPreferences } from "@/context/userPreferences";
import dayjs from "dayjs";
import MoodTagSuggestions from "@/components/Journal/moodTagSuggestions";
import CBTJournalingInfo from "@/components/Journal/CBTInfo";
import JournalEntrySection from "@/components/Journal/JournalEntrySection";
import CBTPromptSelector from "@/components/Journal/CBTPromptSelector";
import LottieView from "lottie-react-native";
import Header from "@/components/header";
import DailyPrompt from "@/components/Journal/dailyPrompt";
import { useCheckInContext } from "@/context/checkInContext";


export default function Journal() {
  const { userPreferences } = useUserPreferences();
  const { moodLabel, energyLabel, sleepLabel, hasCheckedInToday } = useCheckInContext();

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
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>();

  const [entryType, setEntryType] = useState("free"); // free, prompt, mood
  const shouldShowMoodOption = userPreferences?.moodcCheckInBool;

  const entryOptions = [
    { value: "free", label: "Free Write" },
    { value: "prompt", label: "Prompts" },
  ];

  if (shouldShowMoodOption) {
    entryOptions.push({ value: "mood", label: "Mood" });
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
      return <MoodTagSuggestions mood={moodLabel ?? 2} />;
    }
    if (entryType === "prompt") {
      return (
        <>
          <CBTJournalingInfo />
          <CBTPromptSelector onPromptSelect={setSelectedPrompt} />
        </>
      );
    }
    return null;
  };

  return (
    <>
      
      <Header title="Journal" />

      <Provider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.container}
              ref={scrollRef}
            >
              <Text style={styles.heading}>
                Hi {userPreferences?.name || "there"} ✨
              </Text>
              <LottieView
                source={require("../assets/animations/write.json")}
                autoPlay
                loop
                
                style={styles.lottie}
              />
              <Text style={styles.sectionTitle}>
                What kind of journaling today?
              </Text>
   
                <SegmentedButtons
                  value={entryType}
                  onValueChange={setEntryType}
                  buttons={entryOptions}
                  style={{ flexWrap: "wrap", width:"100%" }}
                />

              <Text style={styles.modeDescription}>
                {entryType === "free" &&
                  "Write freely about anything on your mind."}
                {entryType === "prompt" &&
                  "Answer structured CBT prompts to guide reflection."}
                {entryType === "mood" &&
                  "Get suggestions based on how you're feeling today."}
              </Text>
              {entryType === "free" && <DailyPrompt />}
              {/* Conditional: If mood mode selected but no check-in */}
              {entryType === "mood" && !hasCheckedInToday ? (
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
                  <JournalEntrySection
                    onFocus={scrollToInput}
                    entryType={entryType as "free" | "prompt" | "mood"}
                    moodLabel={moodLabel ?? ""}
                    onSave={() => {
                      fetchEntries();
                    }}
                  />
                </>
              )}

              <View style={styles.buttons}>
                <Button
                  mode="contained-tonal"
                  textColor="#580b88"
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
      </Provider>
    </>
  );
}
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
    height: "100%",


  },
  segmentedContainer: {
    flexDirection: "row",
    // flexWrap: "wrap",
    // justifyContent: "center",
    marginBottom: 10,
    // width:'100%'
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
    marginTop: 0,
    backgroundColor: "#f8edeb",
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
  lottie:{
    width: "70%",
    height: "20%",
    marginTop: 25,
    alignSelf: "center",
    
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
