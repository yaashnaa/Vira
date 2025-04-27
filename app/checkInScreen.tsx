import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Card, Divider, Provider } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { useCheckInContext } from "@/context/checkInContext";

import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  limit,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import dayjs from "dayjs";
import Header from "@/components/header";
import ImageSelector from "@/components/imageSelector";

const sleepOptions = [
  { label: "Really Struggled", image: require("../assets/images/energyScale/1.png") },
  { label: "Not the Best", image: require("../assets/images/energyScale/2.png") },
  { label: "Okay Sleep", image: require("../assets/images/energyScale/3.png") },
  { label: "Pretty Restful", image: require("../assets/images/energyScale/4.png") },
  { label: "Slept Like a Baby", image: require("../assets/images/energyScale/5.png") },
];

const energyOptions = [
  { label: "Running on Empty", image: require("../assets/images/energyScale/24.png") },
  { label: "A Little Tired", image: require("../assets/images/energyScale/25.png") },
  { label: "Doing Alright", image: require("../assets/images/energyScale/26.png") },
  { label: "Feeling Energized", image: require("../assets/images/energyScale/27.png") },
  { label: "Ready to Take on the Day", image: require("../assets/images/energyScale/28.png") },
];

const moodOptions = [
  { label: "Having a Tough Day", value: 100, image: require("../assets/images/mood/vsad.png") },
  { label: "Not My Best", value: 75, image: require("../assets/images/mood/sad.png") },
  { label: "Hanging in There", value: 50, image: require("../assets/images/mood/neutral.png") },
  { label: "Pretty Good", value: 25, image: require("../assets/images/mood/happy.png") },
  { label: "Feeling Great", value: 0, image: require("../assets/images/mood/vhappy.png") },
];

export default function CheckInScreen() {
  const { userPreferences } = useUserPreferences();
  const { logMood, refreshCheckIn } = useCheckInContext(); // updated
  const today = dayjs().format("YYYY-MM-DD");
  const router = useRouter();

  const [sleep, setSleep] = useState("");
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState("");
  const [checkInId, setCheckInId] = useState<string | null>(null);
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();

  useEffect(() => {
    const fetchCheckIn = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(db, "users", uid, "checkins"),
        where("timestamp", ">=", start),
        where("timestamp", "<=", end),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        const data = docData.data();
        setMood(data.mood || "");
        setSleep(data.sleep || "");
        setEnergy(data.energy || "");
        setCheckInId(docData.id);
      }
    };

    fetchCheckIn();
  }, []);

  const handleSaveCheckIn = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
  
      const data = {
        mood,
        sleep,
        energy,
        date: today,
        timestamp: new Date(),
      };
  
      if (checkInId) {
        const docRef = doc(db, "users", userId, "checkins", checkInId);
        await updateDoc(docRef, data);
      } else {
        const newDoc = await addDoc(collection(db, "users", userId, "checkins"), data);
        setCheckInId(newDoc.id);
      }
  
      // ❌ DO NOT call logMood() here anymore
      // const moodValue = moodOptions.find(option => option.label === mood)?.value;
      // if (moodValue !== undefined) {
      //   await logMood(moodValue);
      // }
  
      Toast.show({
        type: "success",
        text1: "Check-in saved! 🌿",
        visibilityTime: 3000,
      });
  
      await refreshCheckIn(); 
      router.replace("/dashboard?refresh=true");
  
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Unable to save your check-in 😞",
      });
    }
  };
  

  return (
    <>
      <Header title="Daily Check-In" backPath="/dashboard" showSettings />
      <Provider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card style={styles.card} elevation={0} mode="elevated">
                <Card.Content>
                  <Text style={styles.sectionTitle}>Mood Check-In</Text>
                  <Text style={styles.helperText}>How are you feeling today?</Text>
                  <ImageSelector
                    options={moodOptions}
                    selectedOption={mood}
                    onSelect={setMood}
                  />
                  {mood && <Text style={styles.selectionLabel}>{mood}</Text>}

                  <Divider style={styles.divider} />

                  <Text style={styles.sectionTitle}>Sleep Check-In</Text>
                  <ImageSelector
                    options={sleepOptions}
                    selectedOption={sleep}
                    onSelect={setSleep}
                  />
                  {sleep && <Text style={styles.selectionLabel}>{sleep}</Text>}

                  <Divider style={styles.divider} />

                  <Text style={styles.sectionTitle}>Energy Check-In</Text>
                  <ImageSelector
                    options={energyOptions}
                    selectedOption={energy}
                    onSelect={setEnergy}
                  />
                  {energy && <Text style={styles.selectionLabel}>{energy}</Text>}

                  <Divider style={styles.divider} />

                  <Button
                    mode="contained"
                    icon="check"
                    onPress={handleSaveCheckIn}
                    textColor="#3b0f04"
                    style={styles.button}
                  >
                    {checkInId ? "Update Check-In" : "Complete Check-In"}
                  </Button>
                </Card.Content>
              </Card>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8EDEB",
    flex: 1,
    padding: 16,
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 24,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#271949",
  },
  helperText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
    fontFamily: "Main-font",
  },
  selectionLabel: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 15,
    color: "#555",
    fontFamily: "Main-font",
  },
  divider: {
    marginVertical: 12,
    borderColor: "#ddd",
    borderWidth: 0.5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FAE1DD",
    borderRadius: 24,
    alignSelf: "center",
    width: "60%",
  },
});
