import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ToastAndroid,
  Platform,
} from "react-native";
import {
  Button,
  Menu,
  Provider,
  Portal,
  Modal,
  List,
  Divider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useUserPreferences } from "@/context/userPreferences";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
export default function EditProfileScreen() {
  const router = useRouter();
  const { userPreferences, updatePreferencesFromFirestore } =
    useUserPreferences();

  const [name, setName] = useState(userPreferences.name ?? "");
  const [ageGroup, setAgeGroup] = useState(userPreferences.ageGroup ?? "");
  const [activityLevel, setActivityLevel] = useState(
    userPreferences.activityLevel ?? ""
  );
  const [physicalHealth, setPhysicalHealth] = useState(
    userPreferences.physicalHealth ?? ""
  );

  const [medicalConditions, setMedicalConditions] = useState(
    userPreferences.medicalConditions?.join(", ") ?? ""
  );
  const [primaryGoals, setPrimaryGoals] = useState<string[]>(
    userPreferences.primaryGoals || []
  );
  const [showGoalsMenu, setShowGoalsMenu] = useState(false);

  const [ageMenuVisible, setAgeMenuVisible] = useState(false);
  const [activityMenuVisible, setActivityMenuVisible] = useState(false);
  const [healthMenuVisible, setHealthMenuVisible] = useState(false);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else alert(msg);
  };

  const handleSave = async () => {
    const updated = {
      name,
      ageGroup,
      activityLevel,
      physicalHealth,
      primaryGoals: primaryGoals.length
        ? primaryGoals
        : ["Improve mental well-being"],

      medicalConditions: medicalConditions
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m),
    };

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid, "preferences", "main");
        await setDoc(docRef, updated, { merge: true });
        await updatePreferencesFromFirestore();
        Toast.show({
          type: "success",
          text1: "Profile Updates",
          text2: "Your changes have been updated 🎉",
          position: "bottom",
        });
        router.back();
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      showToast("Failed to save. Try again.");
    }
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
          text: "EDIT PROFILE",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          placeholder="Your name"
          onChangeText={setName}
        />
        <Divider style={{ marginVertical: 18 }} />

        <Text style={styles.label}>Age Group</Text>
        <Menu
          visible={ageMenuVisible}
          onDismiss={() => setAgeMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setAgeMenuVisible(true)}
              style={styles.dropdown}
            >
                <View style={styles.dropdownRow}>

                <Text style={styles.dropdownText}>
                {ageGroup || "Select age group"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
                </View>
              
            </TouchableOpacity>
          }
        >
          {[
            "Under 18",
            "18–25",
            "26–40",
            "41–55",
            "56+",
            "Prefer not to say",
          ].map((group) => (
            <Menu.Item
              key={group}
              title={group}
              onPress={() => {
                setAgeGroup(group);
                setAgeMenuVisible(false);
              }}
            />
          ))}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>Activity Level</Text>
        <Menu
          visible={activityMenuVisible}
          onDismiss={() => setActivityMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setActivityMenuVisible(true)}
              style={styles.dropdown}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {activityLevel || "Select activity level"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
              </View>
            </TouchableOpacity>
          }
        >
          {[
            "Sedentary (little or no exercise)",
            "Lightly active (1–3 days/week)",
            "Moderately active (3–5 days/week)",
            "Very active (6–7 days/week)",
            "Prefer not to say",
          ].map((level) => (
            <Menu.Item
              key={level}
              title={level}
              onPress={() => {
                setActivityLevel(level);
                setActivityMenuVisible(false);
              }}
            />
          ))}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>Physical Health</Text>
        <Menu
          visible={healthMenuVisible}
          onDismiss={() => setHealthMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setHealthMenuVisible(true)}
              style={styles.dropdown}
            >
                <View style={styles.dropdownRow}>
 
                <Text style={styles.dropdownText}>
                  {physicalHealth || "Select physical health status"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
                </View>
             
            </TouchableOpacity>
          }
        >
          {["Poor", "Average", "Good", "Excellent", "Prefer not to say"].map(
            (h) => (
              <Menu.Item
                key={h}
                title={h}
                onPress={() => {
                  setPhysicalHealth(h);
                  setHealthMenuVisible(false);
                }}
              />
            )
          )}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Portal>
          <Modal
            visible={showGoalsMenu}
            onDismiss={() => setShowGoalsMenu(false)}
            contentContainerStyle={{
              backgroundColor: "#fff",
              padding: 20,
              margin: 20,
              borderRadius: 12,
            }}
          >
            <Text style={[styles.label, { fontSize: 16 }]}>
              Select up to 3 goals
            </Text>
            {[
              "General fitness/health",
              "Weight management or body recomposition",
              "Improve mental well-being",
              "Build consistent eating habits",
              "Enhance social connections or community support",
              "Learn about nutrition and healthy eating",
              "Track progress and set goals",
              "Improve mindfulness or self-care habits",
            ].map((goal) => {
              const isSelected = primaryGoals.includes(goal);
              const canSelectMore = primaryGoals.length < 3;

              return (
                <List.Item
                  key={goal}
                  title={goal}
                  titleStyle={{ color: "#2a1a5e" }} // Darker text color
                  onPress={() => {
                    setPrimaryGoals((prev) =>
                      isSelected
                        ? prev.filter((g) => g !== goal)
                        : canSelectMore
                          ? [...prev, goal]
                          : prev
                    );
                  }}
                  left={() => (
                    <List.Icon
                      icon={
                        isSelected
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      color="#2a1a5e" // Darker icon color
                    />
                  )}
                  disabled={!isSelected && !canSelectMore}
                />
              );
            })}

            <Button
              mode="contained"
              onPress={() => setShowGoalsMenu(false)}
              style={{ marginTop: 12, backgroundColor: "#865dff" }}
            >
              Done
            </Button>
          </Modal>
        </Portal>
        <Text style={styles.label}>Primary Goals</Text>
        <TouchableOpacity
          onPress={() => setShowGoalsMenu(true)}
          style={styles.dropdown}
        >
            <View style={styles.dropdownRow}>
            <Text style={styles.dropdownText}>Edit Goals (up to 3)</Text>
            <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
            </View>
        
        </TouchableOpacity>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>Medical Conditions (optional)</Text>
        <TextInput
          style={styles.input}
          value={medicalConditions}
          onChangeText={setMedicalConditions}
          placeholder="e.g. Asthma, Diabetes"
        />

        <Button mode="contained" style={styles.button} onPress={handleSave}>
          Save Changes
        </Button>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 16 },
  label: {
    fontSize: 17,
    fontFamily: "Main-font",
    color: "#3a3a3a",
    // marginTop: 16,
    // marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    fontFamily: "Main-font",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#865dff",
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  goalTag: {
    backgroundColor: "#f9f3ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  goalText: {
    fontFamily: "Main-font",
    color: "#3e2a6e",
    fontSize: 14,
  },
  placeholder: {
    fontStyle: "italic",
    color: "#888",
  },
  dropdown: {
    padding: 12,
    borderRadius: 8,
    // borderWidth: 0.5,
    // backgroundColor: "#fff6f6",
    // marginBottom: 12,
  },
  dropdownText: {
    color: "#3c3c3c",
    fontFamily: "Main-font",
    fontSize: 14,
  },
});
