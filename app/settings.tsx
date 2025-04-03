import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Menu,
  RadioButton,
  Provider,
  Checkbox,
} from "react-native-paper";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // adjust path as needed
import { getAuth } from "firebase/auth";
import MentalHealthCheckboxModal from "@/components/mentalHealthModal";
import { storePreferencesLocally } from "../utils/asyncStorage"; // Adjust the path as necessary
import BasicButton from "@/components/basicButton";
import { useUserPreferences } from "../context/userPreferences"; // Adjust the path as necessary
import { useRouter } from "expo-router";
import { auth } from "@/config/firebaseConfig";

export default function Settings() {
  // Get current preferences and the updater function from the context.
  const { userPreferences, updatePreferences } = useUserPreferences();
  const router = useRouter();

  // Local state initialized from context
  const [name, setName] = useState(userPreferences.name);
  const [ageGroup, setAgeGroup] = useState(userPreferences.ageGroup);
  const [activityLevel, setActivityLevel] = useState(
    userPreferences.activityLevel
  );
  const [showMedicalMenu, setShowMedicalMenu] = useState(false);
  const [showMentalMenu, setShowMentalMenu] = useState(false);

  // For medical conditions, we'll assume the user types a comma-separated string
  const [medicalConditions, setMedicalConditions] = useState(
    userPreferences.medicalConditions.join(", ")
  );
  // For mental disorder, if multiple selections are not allowed, use a single string.
  const [mentalDisorder, setMentalDisorder] = useState<string[]>(
    userPreferences.mentalHealthConditions
  );
  const [customDisorder, setCustomDisorder] = useState(
    userPreferences.customMentalHealthConditions
  );
  const [customMedicalConditions, setCustomMedicalConditions] = useState(
    userPreferences.customMedicalConditions
  );
  // Dietary preferences as an array; if you want to edit them via a comma-separated string, you could also store them as string.
  const [dietPreferences, setDietPreferences] = useState<string[]>(
    userPreferences.dietaryPreferences
  );
  const [customDiet, setCustomDiet] = useState(
    userPreferences.customDietaryPreferences.join(", ")
  );
  const [mealLoggingComfort, setMealLoggingComfort] = useState(
    userPreferences.mealLogging
  );
  const [physicalHealth, setPhysicalHealth] = useState(
    userPreferences.physicalHealth
  );
  // For booleans stored as strings in an input, we convert on save.
  const [calorieViewing, setCalorieViewing] = useState(
    userPreferences.calorieViewing.toString()
  );
  const [remindersFrequency, setRemindersFrequency] = useState(
    userPreferences.remindersFrequency
  );
  const [hideMealTracking, setHideMealTracking] = useState(
    userPreferences.hideMealTracking
  );
  const [anxiousFood, setAnxiousFood] = useState(userPreferences.foodAnxiety);
  const [primaryGoals, setPrimaryGoals] = useState<string[]>(
    userPreferences.primaryGoals
  );
  const [moodCheckIn, setMoodCheckIn] = useState(
    userPreferences.moodCheckIn.toString()
  );
  const [mentalHealthResouces, setMentalHealthResouces] = useState(
    userPreferences.mentalHealthSupport
  );
  const [hideTriggers, setHideTriggers] = useState(
    userPreferences.triggerWarnings
  );
  const [approach, setApproach] = useState(userPreferences.approach);
  const [customGoal, setCustomGoal] = useState(
    userPreferences.customGoals.join(", ")
  );
  const [showAgeMenu, setShowAgeMenu] = useState(false);
  const [showActivityMenu, setshowActivityMenu] = useState(false);
  const [showDietMenu, setShowDietMenu] = useState(false);

  // Optional additional fields:
  // (If you have fields like dataConsent or showResourceConsent in context, include them as needed.)

  useEffect(() => {
    // Update local state when context changes
    setName(userPreferences.name);
    setAgeGroup(userPreferences.ageGroup);
    setActivityLevel(userPreferences.activityLevel);
    setMentalDisorder(userPreferences.mentalHealthConditions);
    setCustomDisorder(userPreferences.customMentalHealthConditions);
    setCustomMedicalConditions(userPreferences.customMedicalConditions);
    setDietPreferences(userPreferences.dietaryPreferences);
    setCustomDiet(userPreferences.customDietaryPreferences.join(", "));
    setMealLoggingComfort(userPreferences.mealLogging);
    setPhysicalHealth(userPreferences.physicalHealth);
    setCalorieViewing(userPreferences.calorieViewing.toString());
    setRemindersFrequency(userPreferences.remindersFrequency);
    setHideMealTracking(userPreferences.hideMealTracking);
    setAnxiousFood(userPreferences.foodAnxiety);
    setPrimaryGoals(userPreferences.primaryGoals);
    setMoodCheckIn(userPreferences.moodCheckIn.toString());
    setMentalHealthResouces(userPreferences.mentalHealthSupport);
    setHideTriggers(userPreferences.triggerWarnings);
    setApproach(userPreferences.approach);
    setCustomGoal(userPreferences.customGoals.join(", "));
  }, [userPreferences]);

  const handleSave = async () => {
    const updated = {
      name,
      ageGroup,
      activityLevel,
      medicalConditions: medicalConditions
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      mentalHealthConditions: mentalDisorder,
      customMentalHealthConditions: customDisorder,
      customMedicalConditions: customMedicalConditions,
      dietaryPreferences: dietPreferences,
      customDietaryPreferences: customDiet
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      mealLogging: mealLoggingComfort,
      physicalHealth,
      calorieViewing: calorieViewing.toLowerCase() === "true",
      macroViewing: userPreferences.macroViewing,
      foodAnxiety: anxiousFood,
      primaryGoals: primaryGoals,
      moodCheckIn: moodCheckIn.toLowerCase() === "true",
      mentalHealthSupport: mentalHealthResouces,
      triggerWarnings: hideTriggers,
      approach,
      customGoals: customGoal
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      mentalHealthOptIn: userPreferences.mentalHealthOptIn,
      remindersFrequency,
      hideMealTracking,
    };

    try {
      updatePreferences(updated);
  
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
  
        await updateDoc(userDocRef, updated);
        console.log("✅ Firestore updated for UID:", currentUser.uid);
  
        await storePreferencesLocally(currentUser.uid, {
          ...userPreferences,
          ...updated,
        });
        console.log("✅ Preferences saved locally for UID:", currentUser.uid);
      }
  
      console.log("🎉 User Preferences Submitted & Stored!");
      router.replace("/dashboard");
    } catch (error) {
      console.error("🔥 Failed to update Firestore:", error);
      alert("Error saving preferences. Please try again.");
    }
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Menu
            visible={showAgeMenu}
            onDismiss={() => setShowAgeMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setShowAgeMenu(true)}
                style={styles.dropdown}
              >
                <Text>{ageGroup || "Select Age Group"}</Text>
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
                  setShowAgeMenu(false);
                }}
              />
            ))}
          </Menu>

          <Text style={styles.label}>Activity Level</Text>
          <Menu
            visible={showActivityMenu}
            onDismiss={() => setshowActivityMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setshowActivityMenu(true)}
                style={styles.dropdown}
              >
                <Text style={{ color: activityLevel ? "#000" : "#888" }}>
                  {activityLevel || "Select your activity level"}
                </Text>
              </TouchableOpacity>
            }
          >
            {[
              "Sedentary (little or no exercise)",
              "Lightly active (1–3 days/week)",
              "Moderately active (3–5 days/week)",
              "Very active (6–7 days/week)",
              "Prefer not to say",
            ].map((group) => (
              <Menu.Item
                key={group}
                title={group}
                onPress={() => {
                  setActivityLevel(group);
                  setshowActivityMenu(false);
                }}
              />
            ))}
          </Menu>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Do you have medical conditions?</Text>

            <Menu
              visible={showMedicalMenu}
              onDismiss={() => setShowMedicalMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowMedicalMenu(true)}
                  style={styles.dropdown}
                >
                  <Text style={{ color: medicalConditions ? "#000" : "#888" }}>
                    {medicalConditions || "Select an option"}
                  </Text>
                </TouchableOpacity>
              }
            >
              {["Yes", "No", "Prefer not to say"].map((option) => (
                <Menu.Item
                  key={option}
                  title={option}
                  onPress={() => {
                    setMedicalConditions(option);
                    setShowMedicalMenu(false);
                  }}
                />
              ))}
            </Menu>

            {medicalConditions === "Yes" && (
              <TextInput
                style={styles.input}
                value={customMedicalConditions}
                onChangeText={setCustomMedicalConditions}
                placeholder="Please specify your medical condition(s)"
              />
            )}
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>
              Diagnosed or self-identified mental health conditions (Select all
              that apply)
            </Text>
            <MentalHealthCheckboxModal
              mentalDisorder={mentalDisorder}
              setMentalDisorder={setMentalDisorder}
              customDisorder={customDisorder}
              setCustomDisorder={setCustomDisorder}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Dietary Preferences</Text>

            <Menu
              visible={showDietMenu}
              onDismiss={() => setShowDietMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowDietMenu(true)}
                  style={styles.dropdown}
                >
                  <Text
                    style={{ color: dietPreferences.length ? "#000" : "#888" }}
                  >
                    {dietPreferences.length > 0
                      ? dietPreferences.join(", ")
                      : "Select your dietary preferences"}
                  </Text>
                </TouchableOpacity>
              }
            >
              {[
                "None",
                "Vegetarian",
                "Vegan",
                "Gluten-free",
                "Dairy-free",
                "Other",
              ].map((option) => (
                <Menu.Item
                  key={option}
                  title={
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Checkbox
                        status={
                          dietPreferences.includes(option)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => {
                          setDietPreferences((prev) =>
                            prev.includes(option)
                              ? prev.filter((item) => item !== option)
                              : [...prev, option]
                          );
                        }}
                      />
                      <Text>{option}</Text>
                    </View>
                  }
                  onPress={() => {
                    setDietPreferences((prev) =>
                      prev.includes(option)
                        ? prev.filter((item) => item !== option)
                        : [...prev, option]
                    );
                  }}
                />
              ))}
            </Menu>

            {dietPreferences.includes("Other") && (
              <TextInput
                style={styles.input}
                value={customDiet}
                onChangeText={setCustomDiet}
                placeholder="Please specify"
              />
            )}
          </View>
          <Text style={styles.label}>Meal Logging Comfort</Text>
          <TextInput
            style={styles.input}
            value={mealLoggingComfort}
            onChangeText={setMealLoggingComfort}
            placeholder="Enter your comfort level with meal logging"
          />

          <Text style={styles.label}>Physical Health</Text>
          <TextInput
            style={styles.input}
            value={physicalHealth}
            onChangeText={setPhysicalHealth}
            placeholder="Describe your physical health"
          />

          <Text style={styles.label}>Calorie Viewing (true/false)</Text>
          <TextInput
            style={styles.input}
            value={calorieViewing}
            onChangeText={setCalorieViewing}
            placeholder="true or false"
          />

          <Text style={styles.label}>Reminders Frequency</Text>
          <TextInput
            style={styles.input}
            value={remindersFrequency}
            onChangeText={setRemindersFrequency}
            placeholder="Enter reminders frequency (e.g., Standard)"
          />

          <Text style={styles.label}>Hide Meal Tracking (true/false)</Text>
          <TextInput
            style={styles.input}
            value={hideMealTracking ? "true" : "false"}
            onChangeText={(text) =>
              setHideMealTracking(text.toLowerCase() === "true")
            }
            placeholder="true or false"
          />

          <Text style={styles.label}>Food Anxiety</Text>
          <TextInput
            style={styles.input}
            value={anxiousFood}
            onChangeText={setAnxiousFood}
            placeholder="Describe your food anxiety"
          />

          <Text style={styles.label}>Primary Goals</Text>
          <TextInput
            style={styles.input}
            value={primaryGoals.join(", ")}
            onChangeText={(text) =>
              setPrimaryGoals(text.split(",").map((item) => item.trim()))
            }
            placeholder="Enter primary goals separated by commas"
          />

          <Text style={styles.label}>Mood Check-In (true/false)</Text>
          <TextInput
            style={styles.input}
            value={moodCheckIn}
            onChangeText={setMoodCheckIn}
            placeholder="true or false"
          />

          <Text style={styles.label}>Mental Health Support</Text>
          <TextInput
            style={styles.input}
            value={mentalHealthResouces}
            onChangeText={setMentalHealthResouces}
            placeholder="Enter details on mental health support"
          />

          <Text style={styles.label}>Trigger Warnings</Text>
          <TextInput
            style={styles.input}
            value={hideTriggers}
            onChangeText={setHideTriggers}
            placeholder="Enter any trigger warnings"
          />

          <Text style={styles.label}>Approach</Text>
          <TextInput
            style={styles.input}
            value={approach}
            onChangeText={setApproach}
            placeholder="Describe your approach"
          />

          <Text style={styles.label}>Custom Goals</Text>
          <TextInput
            style={styles.input}
            value={customGoal}
            onChangeText={setCustomGoal}
            placeholder="Enter custom goals separated by commas"
          />

          <BasicButton onPress={handleSave}>
            <Text style={{ color: "black" }}>Save Changes</Text>
          </BasicButton>

          {/* Optionally, you can add a button to navigate back or to another screen */}
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
  },
  input: {
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    padding: 10,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
});
