import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,

} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Menu, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useUserPreferences } from "@/context/userPreferences";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Header from "@/components/header";
import { scheduleWaterReminders } from "@/utils/waterReminderScheduler";
import { scheduleUserNotifications } from "@/utils/notificationScheduler";
import { checkAndScheduleDailyReminder } from "@/utils/checkAndScheduleReminder";
const encouragementOptions = [
  "Gentle & Kind",
  "Cheerful & Motivating",
  "Minimal",
  "None",
] as const;

type EncouragementType = (typeof encouragementOptions)[number];
export default function NotificationsScreen() {
  const { userPreferences, updatePreferences } = useUserPreferences();
  const router = useRouter();
  const [waterReminderFrequency, setWaterReminderFrequency] = useState<number>(
    userPreferences.waterReminderFrequency ?? 3
  );

  const [remindersFrequency, setRemindersFrequency] = useState(
    userPreferences.remindersFrequency ?? ""
  );
  const [encouragement, setEncouragement] =
    useState<EncouragementType>("Gentle & Kind");

  const [soundPreference, setSoundPreference] = useState(
    userPreferences.notificationSound ?? ""
  );

  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [waterReminderEnabled, setWaterReminderEnabled] = useState<boolean>(
    userPreferences.waterReminderEnabled ?? false
  );

  const [showWaterFrequencyMenu, setShowWaterFrequencyMenu] = useState(false);

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
        waterReminderEnabled,
        waterReminderFrequency,
      };
      if (waterReminderEnabled) {
        await scheduleWaterReminders(waterReminderFrequency);
      }

      await setDoc(doc(db, "users", uid, "preferences", "main"), updated, {
        merge: true,
      });
      updatePreferences(updated);
      await scheduleUserNotifications(remindersFrequency, encouragement); // 💬 ✨ added here!

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
    <>
      <Header title="Notifications" backPath="/settings" />

      <View style={styles.container}>
        <View style={{ position: "relative", zIndex: 10 }}>
          <Text style={styles.label}>Reminder Frequency</Text>
          <Menu
            contentStyle={{ backgroundColor: "#fefdff" }}
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
            anchorPosition="bottom"
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
                titleStyle={{ color: "#6b4c9a", fontSize: 14 }}
                onPress={() => {
                  setRemindersFrequency(option);
                  setShowReminderMenu(false);
                }}
              />
            ))}
          </Menu>
        </View>

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

        <Text style={styles.label}>Encouragement Style</Text>
        <Menu
          visible={showEncourageMenu}
          contentStyle={{ backgroundColor: "#fefdff" }}
          anchorPosition="bottom"
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
                titleStyle={{ color: "#6b4c9a", fontSize: 14 }}
                onPress={() => {
                  setEncouragement(option as EncouragementType);

                  setShowEncourageMenu(false);
                }}
              />
            )
          )}
        </Menu>
        <Text style={styles.label}>Enable Water Reminders</Text>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setWaterReminderEnabled(!waterReminderEnabled)}
        >
          <Ionicons
            name={waterReminderEnabled ? "checkbox" : "square-outline"}
            size={24}
            color="#5a5a5a"
          />
          <Text style={styles.checkboxLabel}>
            {waterReminderEnabled ? "Enabled" : "Disabled"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Enable Water Reminders</Text>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setWaterReminderEnabled(!waterReminderEnabled)}
        >
          {/* checkbox UI */}
        </TouchableOpacity>

        {!waterReminderEnabled && (
          <Text style={styles.helperText}>
            Enable Water Reminders to set frequency.
          </Text>
        )}

        {/* Wrap the water‐frequency menu in its own zIndex layer */}
        <View style={{ position: "relative", zIndex: 10 }}>
          <Text style={styles.label}>Water Reminder Frequency</Text>
          <Menu
            visible={showWaterFrequencyMenu}
            anchorPosition="top"
            onDismiss={() => setShowWaterFrequencyMenu(false)}
            anchor={
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  !waterReminderEnabled && { opacity: 0.5 },
                ]}
                onPress={() => setShowWaterFrequencyMenu(true)}
                disabled={!waterReminderEnabled}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {waterReminderFrequency
                      ? `Every ${waterReminderFrequency} hours`
                      : "Set reminder frequency"}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
                </View>
              </TouchableOpacity>
            }
       
            contentStyle={{ backgroundColor: "#fefdff" }}
          >
            {[2, 3, 4].map((hours) => (
              <Menu.Item
                key={hours}
                titleStyle={{ color: '#6b4c9a', fontSize: 14 }}
                title={`Every ${hours} hours`}
                onPress={() => {
                  setWaterReminderFrequency(hours);
                  setShowWaterFrequencyMenu(false);
                }}
              />
            ))}
          </Menu>
        </View>
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
      </View>
    </>
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
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    marginBottom: 8,
    fontFamily: "Main-font",
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2a2a2a",
    fontFamily: "Main-font",
  },
});
