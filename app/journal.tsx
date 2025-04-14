import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { db, auth } from "@/config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import CustomMoonRating from "../components/customMoonRating";
import { Rating } from "@rneui/themed";
import { Modal, Portal, Button, Provider, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import JournalEntry from "@/components/Journal/journalEntry";
import { useUserPreferences } from "@/context/userPreferences";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useMoodContext } from "@/context/moodContext";
import dayjs from "dayjs";
import SuggestionCard from "@/components/Journal/suggestionCard";

const energyOptions = [
  { label: "Exhausted", image: require("../assets/images/energyScale/1.png") },
  { label: "Low Energy", image: require("../assets/images/energyScale/2.png") },
  { label: "Okay", image: require("../assets/images/energyScale/3.png") },
  { label: "Energized", image: require("../assets/images/energyScale/4.png") },
  {
    label: "Fully Charged",
    image: require("../assets/images/energyScale/5.png"),
  },
];

export default function JournalScreen() {
  const { userPreferences } = useUserPreferences();
  const [sleepRating, setSleepRating] = useState(0);
  const [checkInComplete, setCheckInComplete] = useState(false);
  const { mood } = useMoodContext();
  const today = dayjs().format("YYYY-MM-DD");
  const router = useRouter();
  const [isNewEntryVisible, setIsNewEntryVisible] = useState(false);
  const [sleepQuality, setSleepQuality] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [reflection, setReflection] = useState("");
  const [entries, setEntries] = useState<
    {
      id: string;
      sleepQuality?: string;
      energyLevel?: string;
      reflection?: string;
      mood?: string;
      date?: string;
      timestamp?: Date;
    }[]
  >([]);

  const handleSaveCheckIn = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(db, "users", userId, "journalEntries"), {
        sleepQuality,
        energyLevel,
        reflection,
        mood,
        date: today,
        sleepRating,
        timestamp: new Date(),
      });
      setSleepQuality("");
      setEnergyLevel("");
      setReflection("");
      fetchEntries();
      const todayEntry:
        | {
            id: string;
            sleepQuality?: string;
            energyLevel?: string;
            reflection?: string;
            mood?: string;
            date?: string;
            timestamp?: Date;
          }
        | undefined = entries.find((entry) => entry.date === today);
      if (todayEntry) {
        setCheckInComplete(true);
      }
      Alert.alert("Success", "Check-in saved!");
      setCheckInComplete(true);
    } catch (error) {
      console.error("Error saving check-in:", error);
      Alert.alert("Error", "Failed to save check-in.");
    }
  };

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
  const ratingProps = {};
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
        <KeyboardAvoidingView>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Text style={styles.heading}>
                Hi {userPreferences?.name || "there"} ✨
              </Text>
              <Text style={styles.subHeading}>Today's Check-In ({today})</Text>

              {checkInComplete ? (
                <SuggestionCard mood={mood} energyLevel={energyLevel} />
              ) : (
                <Card style={styles.card}>
                  <Card.Content>
                    <Text style={styles.label}>How did you sleep?</Text>
                    <CustomMoonRating
                      rating={sleepRating}
                      onChange={setSleepRating}
                    />
                    <Text style={styles.energyLabel}>
                      {sleepRating > 0 && `Sleep Rating: ${sleepRating} / 5`}
                    </Text>
                    <Text style={styles.label}>How's your energy today?</Text>
                    <View style={styles.energyContainer}>
                      {energyOptions.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setEnergyLevel(option.label)}
                          style={[
                            styles.energyOption,
                            energyLevel === option.label &&
                              styles.energySelected,
                          ]}
                        >
                          <Image
                            source={option.image}
                            style={styles.energyImage}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                    {energyLevel && (
                      <Text style={styles.energyLabel}>{energyLevel}</Text>
                    )}
                    <Text style={styles.label}>What's on your mind?</Text>

                    <TextInput
                      style={[styles.input, styles.journalBox]}
                      placeholder="Free write your thoughts here..."
                      value={reflection}
                      onChangeText={setReflection}
                      multiline
                    />

                    <Button
                      mode="contained-tonal"
                      icon="check"
                      textColor="#580b88"
                      onPress={handleSaveCheckIn}
                      style={styles.button}
                    >
                      Save Check-in
                    </Button>
                  </Card.Content>
                </Card>
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
            </View>
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
    height: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#622f00",
  },
  actionButton: {
    padding: 5,

    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#b488d0",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontFamily: "Main-font",
    marginTop: 8,
  },
  journalBox: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#f8f6f4",
    marginBottom: 24,
    borderRadius: 12,
    padding: 0,
    // elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    backgroundColor: "#f8f6f4",
    width: "50%",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    height: "105%",
  },
  entryCard: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  entryBody: {
    fontSize: 14,
    color: "#555",
  },
  rating: {
    paddingVertical: 10,
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  energyContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    margin: "auto",
    padding: 0,
  },
  energyOption: {
    alignItems: "center",
    // padding: 6,
    flex: 1,
  },
  energySelected: {
    borderColor: "#b488d0",
    borderWidth: 2,
    borderRadius: 8,
  },
  energyLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "Main-font",
  },
  energyImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
});
