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
} from "react-native";
import { db, auth } from "@/config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { Modal, Portal, Button, Provider, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import JournalEntry from "@/components/Journal/journalEntry";
import { useUserPreferences } from "@/context/userPreferences";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useMoodContext } from "@/context/moodContext";
import dayjs from "dayjs";

export default function JournalScreen() {
  const { userPreferences } = useUserPreferences();
  const { mood } = useMoodContext();
  const today = dayjs().format("YYYY-MM-DD");
  const router=  useRouter();
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
        timestamp: new Date(),
      });
      setSleepQuality("");
      setEnergyLevel("");
      setReflection("");
      fetchEntries();
      Alert.alert("Success", "Check-in saved!");
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
          text: "MOOD TRACKER",
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
              onPress={handleBackPress}
            >
              <Icon name="settings" size={25} type="feather" color="#271949" />
            </TouchableOpacity>
          </View>
        }
      />
      <Provider>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>
            Hi {userPreferences?.name || "there"} ✨
          </Text>
          <Text style={styles.subHeading}>Today's Check-In ({today})</Text>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.label}>How did you sleep?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 7 hours, felt rested"
                value={sleepQuality}
                onChangeText={setSleepQuality}
              />

              <Text style={styles.label}>How's your energy today?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sluggish, Energetic"
                value={energyLevel}
                onChangeText={setEnergyLevel}
              />

              <Text style={styles.label}>What's on your mind?</Text>
              <TextInput
                style={[styles.input, styles.journalBox]}
                placeholder="Free write your thoughts here..."
                value={reflection}
                onChangeText={setReflection}
                multiline
              />

              <Button
                mode="contained"
                onPress={handleSaveCheckIn}
                style={styles.button}
              >
                Save Check-in
              </Button>
            </Card.Content>
          </Card>

          <Text style={styles.heading}>Your Journal</Text>
          <Button mode="contained" onPress={() => setIsNewEntryVisible(true)}>
            New Entry
          </Button>

          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.entryCard}>
                <Card.Content>
                  <Text style={styles.entryTitle}>{item.date}</Text>
                  <Text style={styles.entryBody}>{item.reflection}</Text>
                </Card.Content>
              </Card>
            )}
          />
        </ScrollView>

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
    backgroundColor: "#f8f6f4",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#622f00",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#c13e6a",
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
    backgroundColor: "#fff",
    marginBottom: 24,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#c13e6a",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  entryCard: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 10,
    padding: 16,
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
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
});
