import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Menu, Button, Provider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useUserPreferences } from "@/context/userPreferences";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkAndScheduleDailyReminder } from "@/utils/checkAndScheduleReminder";
export default function NotificationsScreen() {
  const { userPreferences, updatePreferences } = useUserPreferences();
  const router = useRouter();

  const [remindersFrequency, setRemindersFrequency] = useState(
    userPreferences.remindersFrequency ?? ""
  );
  const [encouragement, setEncouragement] = useState(
    userPreferences.encouragementNotifications ?? ""
  );
  const [soundPreference, setSoundPreference] = useState(
    userPreferences.notificationSound ?? ""
  );

  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showEncourageMenu, setShowEncourageMenu] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(
    userPreferences.notificationTime
      ? new Date(userPreferences.notificationTime)
      : new Date()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: any, date?: Date | undefined): void => {
    if (date) {
      setSelectedTime(date);
    }
    setShowTimePicker(false);
  };

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const updated = {
        ...userPreferences,
        remindersFrequency,
        notificationTime: selectedTime.toISOString(),
      };

      await setDoc(doc(db, "users", uid, "preferences", "main"), updated, {
        merge: true,
      });
      updatePreferences(updated);
      await checkAndScheduleDailyReminder(selectedTime);

      showToast("Notification settings saved.");
      router.back();
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      alert("Failed to save settings.");
    }
  };
  const showToast = (msg: string) => {
    Toast.show({
      type: "success", // or "error", "info"
      text1: msg,
      position: "bottom",
      visibilityTime: 2500,
    });
  };

  return (
    <Provider>
      <HeaderRNE
        containerStyle={{ backgroundColor: "#f8edeb", borderBottomWidth: 0 }}
        leftComponent={
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" type="ionicon" color="#190028" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "NOTIFICATIONS SETTINGS",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          

          {/* Reminder Frequency */}
          <Text style={styles.label}>Reminder Frequency</Text>
          <Menu
            visible={showReminderMenu}
            onDismiss={() => setShowReminderMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowReminderMenu(true)}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {remindersFrequency || "Choose frequency"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
                </View>
              </TouchableOpacity>
            }
          >
            {[
              "None",
              "Minimal (1x per day)",
              "Standard (2–3x per day)",
              "Frequent (throughout the day)",
            ].map((option) => (
              <Menu.Item
                key={option}
                title={option}
                titleStyle={styles.menuText}
                onPress={() => {
                  setRemindersFrequency(option);
                  setShowReminderMenu(false);
                }}
              />
            ))}
          </Menu>
          <Text style={styles.label}>Daily Reminder Time</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowTimePicker(true)}
          >
            <View style={styles.dropdownRow}>
              <Text style={styles.dropdownText}>
                {selectedTime
                  ? selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select a time"}
              </Text>
              <Ionicons name="time" size={18} color="#2d2d2d" />
            </View>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={selectedTime}
              is24Hour={false}
              display="spinner"
              onChange={handleTimeChange}
              textColor="#0f0a1b" // Change this to your desired color
            />
          )}

          {/* Sound */}
          <Text style={styles.label}>Notification Sound</Text>
          <Menu
            visible={showSoundMenu}
            onDismiss={() => setShowSoundMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowSoundMenu(true)}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {soundPreference || "Select sound style"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
                </View>
              </TouchableOpacity>
            }
          >
            {["Default", "Chime", "Soft Bell", "Silent"].map((option) => (
              <Menu.Item
                key={option}
                title={option}
                titleStyle={styles.menuText}
                onPress={() => {
                  setSoundPreference(option);
                  setShowSoundMenu(false);
                }}
              />
            ))}
          </Menu>

          {/* Encouragement Style */}
          <Text style={styles.label}>Encouragement Style</Text>
          <Menu
            visible={showEncourageMenu}
            onDismiss={() => setShowEncourageMenu(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowEncourageMenu(true)}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {encouragement || "Select encouragement tone"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
                </View>
              </TouchableOpacity>
            }
          >
            {["Gentle & Kind", "Cheerful & Motivating", "Minimal", "None"].map(
              (option) => (
                <Menu.Item
                  key={option}
                  title={option}
                  titleStyle={styles.menuText}
                  onPress={() => {
                    setEncouragement(option);
                    setShowEncourageMenu(false);
                  }}
                />
              )
            )}
          </Menu>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            contentStyle={{ paddingVertical: 6 }}
            labelStyle={{
              fontFamily: "Main-font",
              color: "#fff",
              fontSize: 16,
            }}
          >
            Save Preferences
          </Button>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  heading: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#2a2a2a",
    marginTop: 20,
    marginBottom: 6,
    fontFamily: "Main-font",
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  dropdownText: {
    fontFamily: "Main-font",
    color: "#2a2a2a",
    fontSize: 14,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#865dff",
    marginTop: 24,
    borderRadius: 8,
  },
});
