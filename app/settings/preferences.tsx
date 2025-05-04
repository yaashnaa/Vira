import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/header";
export default function EmotionalPreferencesScreen() {
  const { userPreferences, updatePreferences } = useUserPreferences();
  const router = useRouter();
  const [tonePreference, setTonePreference] = useState(
    userPreferences.tonePreference ?? ""
  );
  const [copingConsent, setCopingConsent] = useState(
    userPreferences.copingToolsConsent ?? ""
  );
  const [contentAvoidance, setContentAvoidance] = useState(
    userPreferences.contentAvoidance ?? ""
  );
  const [moodCheckIn, setMoodCheckIn] = useState(
    userPreferences.moodCheckIn ?? ""
  );
  const [userNotes, setUserNotes] = useState(userPreferences.userNotes ?? "");

  const [showToneMenu, setShowToneMenu] = useState(false);
  const [showCopingMenu, setShowCopingMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showMoodCheckInMenu, setShowMoodCheckInMenu] = useState(false);
  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const updates = {
        ...userPreferences,
        moodCheckIn,
        moodcCheckInBool:
          moodCheckIn === "No, I’d rather keep it simple." ? false : true,
        tonePreference,
        contentAvoidance: Array.isArray(contentAvoidance)
          ? contentAvoidance.join(", ")
          : typeof contentAvoidance === "string"
            ? contentAvoidance
            : "",
        copingToolsConsent: copingConsent,
        userNotes,
      };

      await setDoc(doc(db, "users", uid, "preferences", "main"), updates, {
        merge: true,
      });
      updatePreferences(updates);
      Toast.show({
        type: "success",
        text1: "Preferences Saved",
        text2: "Your changes have been updated 🎉",
        position: "bottom",
      });
      router.back();
    } catch (error) {
      console.error("🔥 Error saving preferences:", error);
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <>
    <Header title="Emotional Preferences" backPath="/settings" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Preferred App Tone</Text>
          <Menu
            visible={showToneMenu}
            onDismiss={() => setShowToneMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setShowToneMenu(true)}
                style={styles.dropdown}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {tonePreference || "Select tone"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#7550a7" />
                </View>
              </TouchableOpacity>
            }
          >
            {[
              "Gentle & supportive",
              "Direct & motivating",
              "Flexible — depends on the day",
              "No preference",
            ].map((option) => (
              <Menu.Item
                key={option}
                title={option}
                onPress={() => {
                  setTonePreference(option);
                  setShowToneMenu(false);
                }}
              />
            ))}
          </Menu>
          <Divider style={{ marginVertical: 18 }} />
          <Text style={styles.label}>
            Are you interested in a regular mood check-ins?
          </Text>
          <Menu
            visible={showMoodCheckInMenu}
            onDismiss={() => setShowMoodCheckInMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setShowMoodCheckInMenu(true)}
                style={styles.dropdown}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {moodCheckIn || "Select your preference"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#7550a7" />
                </View>
              </TouchableOpacity>
            }
          >
            {[
              "Yes, definitely.",
              "Maybe, but not sure.",
              "No, I’d rather keep it simple.",
            ].map((option) => (
              <Menu.Item
                key={option}
                title={option}
                onPress={() => {
                  setMoodCheckIn(option);
                  setShowMoodCheckInMenu(false);
                }}
              />
            ))}
          </Menu>
          <Divider style={{ marginVertical: 18 }} />
          <Text style={styles.label}>
            Would you like access to coping tools?
          </Text>
          <Menu
            visible={showCopingMenu}
            onDismiss={() => setShowCopingMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setShowCopingMenu(true)}
                style={styles.dropdown}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {copingConsent || "Select your response"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#7550a7" />
                </View>
              </TouchableOpacity>
            }
          >
            {[
              "Yes, always",
              "Yes, but only if I ask",
              "No, I prefer not to",
            ].map((option) => (
              <Menu.Item
                key={option}
                title={option}
                onPress={() => {
                  setCopingConsent(option);
                  setShowCopingMenu(false);
                }}
              />
            ))}
          </Menu>
          <Divider style={{ marginVertical: 18 }} />
          <Text style={styles.label}>Avoid Certain Content?</Text>
          <Menu
            visible={showContentMenu}
            onDismiss={() => setShowContentMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setShowContentMenu(true)}
                style={styles.dropdown}
              >
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>
                    {contentAvoidance || "Select topics to avoid"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#7550a7"
                    style={{ marginRight: 8 }}
                  />
                </View>
              </TouchableOpacity>
            }
          >
            {[
              "Diet talk",
              "Weight loss focus",
              "Body image content",
              "None",
              "Not sure yet",
            ].map((option) => (
              <Menu.Item
                key={option}
                title={option}
                onPress={() => {
                  setContentAvoidance(option);
                  setShowContentMenu(false);
                }}
              />
            ))}
          </Menu>
          <Divider style={{ marginVertical: 18 }} />
          <Text style={styles.label}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={userNotes}
            onChangeText={setUserNotes}
            placeholder="Anything else you'd like us to know?"
          />
          <Button
            mode="elevated"
            onPress={handleSave}
            style={{
              marginTop: 24,
              backgroundColor: "#7550a7",
              borderRadius: 8,
              width: "100%",
            }}
            contentStyle={{ paddingVertical: 6 }}
            labelStyle={{
              fontFamily: "Main-font",
              color: "#ffffff",
              fontSize: 16,
            }}
          >
            Save Changes
          </Button>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    height: "100%",
  },
  heading: {
    fontSize: 21,
    fontFamily: "PatrickHand-Regular",
    color: "#511f73",
    // marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    // fontFamily: "PatrickHand-Regular",
    color: "#2a2a2a",
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    fontFamily: "Main-font",
  },
  dropdown: {
    padding: 12,
    // borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontFamily: "Main-font",
    color: "#2a2a2a",
  },
  header: {
    flexDirection: "row",
    width: width,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff0f6",
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 6,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
