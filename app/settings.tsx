import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";
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
  // For medical conditions, we'll assume the user types a comma-separated string
  const [medicalConditions, setMedicalConditions] = useState(
    userPreferences.medicalConditions.join(", ")
  );
  // For mental disorder, if multiple selections are not allowed, use a single string.
  const [mentalDisorder, setMentalDisorder] = useState(
    userPreferences.mentalHealthConditions.join(", ")
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
  // Optional additional fields:
  // (If you have fields like dataConsent or showResourceConsent in context, include them as needed.)

  useEffect(() => {
    // Update local state when context changes
    setName(userPreferences.name);
    setAgeGroup(userPreferences.ageGroup);
    setActivityLevel(userPreferences.activityLevel);
    setMentalDisorder(userPreferences.mentalHealthConditions.join(", "));
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
      mentalHealthConditions: mentalDisorder
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
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
  
    // 1. Update context (for immediate in-app changes)
    updatePreferences(updated);
  
    // 2. Also save to AsyncStorage using current user ID
    const currentUser = auth.currentUser;
    if (currentUser) {
      await storePreferencesLocally(currentUser.uid, {
        ...userPreferences,
        ...updated,
      });
    }
  
    console.log("User Preferences Submitted & Stored!");
    router.replace("/dashboard");
  };
  return (
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

        <Text style={styles.label}>Age Group</Text>
        <TextInput
          style={styles.input}
          value={ageGroup}
          onChangeText={setAgeGroup}
          placeholder="Enter your age group"
        />

        <Text style={styles.label}>Activity Level</Text>
        <TextInput
          style={styles.input}
          value={activityLevel}
          onChangeText={setActivityLevel}
          placeholder="Describe your activity level"
        />

        <Text style={styles.label}>Medical Conditions (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={medicalConditions}
          onChangeText={setMedicalConditions}
          placeholder="e.g., Diabetes, Hypertension"
        />

        <Text style={styles.label}>Mental Disorders (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={mentalDisorder}
          onChangeText={setMentalDisorder}
          placeholder="e.g., None, Depression, Other"
        />
        {mentalDisorder.toLowerCase().includes("other") && (
          <>
            <Text style={styles.label}>Custom Mental Health Condition</Text>
            <TextInput
              style={styles.input}
              value={customDisorder}
              onChangeText={setCustomDisorder}
              placeholder="Please specify"
            />
          </>
        )}

        <Text style={styles.label}>Custom Medical Conditions</Text>
        <TextInput
          style={styles.input}
          value={customMedicalConditions}
          onChangeText={setCustomMedicalConditions}
          placeholder="Enter any custom medical conditions"
        />

        <Text style={styles.label}>Dietary Preferences</Text>
        {/* You may implement a multi-select here. For simplicity, we display the current array as text. */}
        <TextInput
          style={styles.input}
          value={dietPreferences.join(", ")}
          onChangeText={(text) =>
            setDietPreferences(text.split(",").map((item) => item.trim()))
          }
          placeholder="Enter dietary preferences separated by commas"
        />

        <Text style={styles.label}>Custom Dietary Preferences</Text>
        <TextInput
          style={styles.input}
          value={customDiet}
          onChangeText={setCustomDiet}
          placeholder="e.g., Vegan, Gluten-free"
        />

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
          <Text style={{ color: 'black' }}>Save Changes</Text>
        </BasicButton>

        {/* Optionally, you can add a button to navigate back or to another screen */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
});
