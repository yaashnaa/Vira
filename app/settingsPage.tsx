import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,TouchableOpacity
} from "react-native";

import {
  Appbar,
  Menu,
  RadioButton,
  Provider,
  Checkbox,
  Divider,
  Button,
  Portal,
  Modal
} from "react-native-paper";

import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { isScreeningQuizCompleted } from "@/utils/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetOnboarding } from "@/utils/resetOnboarding";

import Header from "@/components/header";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // adjust path as needed
import { getAuth } from "firebase/auth";
import { signOut, deleteUser, sendPasswordResetEmail } from "firebase/auth";
import MentalHealthCheckboxModal from "@/components/mentalHealthModal";
import BasicButton from "@/components/Buttons/basicButton";
import { useUserPreferences } from "../context/userPreferences"; // Adjust the path as necessary
import { useRouter } from "expo-router";
import { auth } from "@/config/firebaseConfig";

export default function Settings() {
  // Get current preferences and the updater function from the context.
  const { userPreferences, updatePreferences, updatePreferencesFromFirestore } =
    useUserPreferences();
  const router = useRouter();

  // Local state initialized from context
  const [name, setName] = useState(userPreferences.name);
  const [ageGroup, setAgeGroup] = useState(userPreferences.ageGroup);
  const [activityLevel, setActivityLevel] = useState(
    userPreferences.activityLevel
  );
  const [hasCompletedScreening, setHasCompletedScreening] = useState(false);
  const [showMedicalMenu, setShowMedicalMenu] = useState(false);
  const [showMentalMenu, setShowMentalMenu] = useState(false);

  // For medical conditions, we'll assume the user types a comma-separated string
  const [medicalConditions, setMedicalConditions] = useState(
    (userPreferences.medicalConditions ?? []).join(", ")
  );
  const [moodCheckIn, setMoodCheckIn] = useState<string>(
    userPreferences.moodCheckIn ?? ""
  );
  const [anxiousFood, setAnxiousFood] = useState<string>(
    userPreferences.anxiousFood ?? ""
  );

  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [showFoodAnxietyMenu, setShowFoodAnxietyMenu] = useState(false);
  const [showMentalResourcesMenu, setShowMentalResourcesMenu] = useState(false);
  const [showTriggerMenu, setShowTriggerMenu] = useState(false);

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
  const [caloriePreference, setCaloriePreference] = useState(
    userPreferences.caloriePreference ?? ""
  );
  const [macroPreference, setMacroPreference] = useState(
    userPreferences.macroPreference ?? ""
  );

  // Dietary preferences as an array; if you want to edit them via a comma-separated string, you could also store them as string.
  const [dietPreferences, setDietPreferences] = useState<string[]>(
    userPreferences.dietaryPreferences ?? []
  );
  const [showMealLoggingMenu, setShowMealLoggingMenu] = useState(false);

  const [customDiet, setCustomDiet] = useState(
    (userPreferences.customDietaryPreferences ?? []).join(", ")
  );
  const [mealLoggingComfort, setMealLoggingComfort] = useState(
    userPreferences.mealLogging
  );
  const [physicalHealth, setPhysicalHealth] = useState(
    userPreferences.physicalHealth
  );

  const [remindersFrequency, setRemindersFrequency] = useState(
    userPreferences.remindersFrequency
  );
  const [hideMealTracking, setHideMealTracking] = useState(
    userPreferences.hideMealTracking
  );
  const [foodAnxietyLevel, setFoodAnxietyLevel] = useState(
    userPreferences.foodAnxietyLevel ?? ""
  );
  const [primaryGoals, setPrimaryGoals] = useState<string[]>(
    userPreferences.primaryGoals ?? []
  );
  const [mentalHealthResouces, setMentalHealthResouces] = useState(
    userPreferences.mentalHealthSupport
  );
  const [hideTriggers, setHideTriggers] = useState(
    userPreferences.triggerWarnings
  );
  const [approach, setApproach] = useState(userPreferences.approach);
  const [showAgeMenu, setShowAgeMenu] = useState(false);
  const [showActivityMenu, setshowActivityMenu] = useState(false);
  const [showDietMenu, setShowDietMenu] = useState(false);
  const [showCalorieMenu, setShowCalorieMenu] = useState(false);
  const [showPhysicalMenu, setShowPhysicalMenu] = useState(false);
  const [showMoodCheckInMenu, setShowMoodCheckInMenu] = useState(false);
  const [showMacroMenu, setShowMacroMenu] = useState(false);
  const [showmovementMenu, setShowMovementMenu] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [showContentAvoidanceMenu, setShowContentAvoidanceMenu] =
    useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showCopingMenu, setShowCopingMenu] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [movementRelationship, setMovementRelationship] = useState(
    userPreferences.movementRelationship ?? ""
  );
  const [tonePreference, setTonePreference] = useState(
    userPreferences.tonePreference ?? ""
  );
  const [contentAvoidance, setContentAvoidance] = useState(
    userPreferences.contentAvoidance ?? ""
  );
  const [copingConsent, setCopingConsent] = useState(
    userPreferences.copingToolsConsent ?? ""
  );
  const [userNotes, setUserNotes] = useState(userPreferences.userNotes ?? "");

  useEffect(() => {
    const checkScreening = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const completed = await isScreeningQuizCompleted(uid);
      setHasCompletedScreening(true);
    };

    checkScreening();
  }, []);

  useEffect(() => {
    // Update local state when context changes
    setName(userPreferences.name);
    setAgeGroup(userPreferences.ageGroup);
    setActivityLevel(userPreferences.activityLevel);
    setMentalDisorder(userPreferences.mentalHealthConditions);
    setCustomDisorder(userPreferences.customMentalHealthConditions);
    setCaloriePreference(userPreferences.caloriePreference ?? "");
    setMacroPreference(userPreferences.macroPreference ?? "");
    setCustomMedicalConditions(userPreferences.customMedicalConditions);
    setFoodAnxietyLevel(userPreferences.foodAnxietyLevel ?? true);
    setDietPreferences(userPreferences.dietaryPreferences ?? []);
    setCustomDiet((userPreferences.customDietaryPreferences ?? []).join(", "));
    setMealLoggingComfort(userPreferences.mealLogging);
    setPhysicalHealth(userPreferences.physicalHealth);

    setRemindersFrequency(userPreferences.remindersFrequency);
    setHideMealTracking(userPreferences.hideMealTracking);
    setPrimaryGoals(userPreferences.primaryGoals);
    setMoodCheckIn(
      userPreferences.moodcCheckInBool === true
        ? "Yes, definitely."
        : userPreferences.moodcCheckInBool === false
          ? "No, I’d rather keep it simple."
          : ""
    );

    setMentalHealthResouces(userPreferences.mentalHealthSupport);
    setHideTriggers(userPreferences.triggerWarnings);
    setApproach(userPreferences.approach);
  }, [userPreferences]);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("🔥 Logout failed:", error);
    }
  };

  const handleResetPassword = async () => {
    if (auth.currentUser?.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        alert("Password reset email sent!");
      } catch (error) {
        console.error("🔥 Reset email failed:", error);
        alert("Failed to send reset email");
      }
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        alert("No user is currently signed in.");
        return;
      }

      // Prompt the user for password (or pass in securely from modal input)
      const password = prompt(
        "Please re-enter your password to confirm deletion."
      ); // 👈🏽 Replace this with a secure password modal in production

      if (!password) {
        alert("Password required for deletion.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, password);

      // Reauthenticate
      await reauthenticateWithCredential(user, credential);

      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Delete account
      await deleteUser(user);
      setConfirmDelete(false);
      router.replace("/(auth)/signup");
      alert("Your account has been deleted.");
    } catch (error: any) {
      console.error("🔥 Delete account failed:", error);

      if (error.code === "auth/requires-recent-login") {
        alert("Please re-login and try again.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else {
        alert("Error deleting account. Try again.");
      }
    }
  };

  const handleSave = async () => {
    const updated = {
      name,
      ageGroup,
      activityLevel: activityLevel ?? "",
      medicalConditions: (medicalConditions ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      mentalHealthConditions: Array.isArray(mentalDisorder)
        ? mentalDisorder
        : [],
      customMentalHealthConditions: customDisorder ?? "",
      customMedicalConditions: customMedicalConditions ?? "",
      dietaryPreferences: Array.isArray(dietPreferences) ? dietPreferences : [],
      customDietaryPreferences: customDiet
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
      mealLogging: mealLoggingComfort ?? "",
      physicalHealth: physicalHealth ?? "",
      calorieViewing: caloriePreference === "Yes, I’d like to see calories.",
      macroViewing: macroPreference === "Yes, I’d like to see macros.",
      caloriePreference: caloriePreference ?? "",
      macroPreference: macroPreference ?? "",

      foodAnxiety: [
        "Yes, I often feel anxious",
        "Sometimes, but it's manageable",
      ].includes(anxiousFood),
      foodAnxietyLevel: anxiousFood ?? "",
      primaryGoals: Array.isArray(primaryGoals) ? primaryGoals : [],
      moodCheckIn: moodCheckIn ?? "",
      moodcCheckInBool:
      moodCheckIn === "No, I’d rather keep it simple." ? false : true,
    
      
      mentalHealthSupport: mentalHealthResouces ?? "",
      triggerWarnings: hideTriggers ?? "",
      approach: approach ?? "",
      movementRelationship: movementRelationship ?? "",
      tonePreference: tonePreference ?? "",
      contentAvoidance:
      Array.isArray(contentAvoidance)
        ? contentAvoidance.join(", ")
        : typeof contentAvoidance === "string"
          ? contentAvoidance
          : "",
    
      copingToolsConsent: copingConsent ?? "",
      userNotes: userNotes ?? "",
    };

    try {
      updatePreferences(updated);

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "preferences",
          "main"
        );
        await setDoc(userDocRef, updated, { merge: true });
        await updatePreferencesFromFirestore();
        // console.log("Firestore updated for UID:", currentUser.uid);

        // console.log("Preferences saved locally for UID:", currentUser.uid);
      }
    //   console.log("🎉 User Preferences Submitted & Stored!");
      router.back();
    } catch (error) {
      console.error("🔥 Failed to update Firestore:", error);
      alert("Error saving preferences. Please try again.");
    }
  };

  const handleBackPress = () => {
    router.back();
  };
  return (
    <Provider>
      <Header title="Settings" backPath="/dashboard" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View>
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
                    <Text
                      style={{ color: medicalConditions ? "#000" : "#888" }}
                    >
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

            <View>
              <MentalHealthCheckboxModal
                mentalDisorder={userPreferences.mentalHealthConditions ?? []}
                setMentalDisorder={setMentalDisorder}
                customDisorder={customDisorder}
                setCustomDisorder={setCustomDisorder}
              />
            </View>
            <Text style={styles.label}>Primary Goals</Text>
            <TextInput
              style={styles.input}
              value={(primaryGoals ?? []).join(", ")}
              onChangeText={(text) =>
                setPrimaryGoals(text.split(",").map((item) => item.trim()))
              }
              placeholder="Enter primary goals separated by commas"
            />
          </View>
          {hasCompletedScreening ? (
            <View>
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
                        style={{
                          color: dietPreferences.length ? "#000" : "#888",
                        }}
                      >
                        {(dietPreferences?.length ?? 0) > 0
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
              <Text style={styles.label}>
                Are you comfortable logging your meals?
              </Text>
              <Menu
                visible={showMealLoggingMenu}
                onDismiss={() => setShowMealLoggingMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowMealLoggingMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text
                      style={{ color: mealLoggingComfort ? "#000" : "#888" }}
                    >
                      {mealLoggingComfort || "Select your comfort level"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Yes, I’m okay with logging (including approximate calories or macros).",
                  "I’d prefer to log only general descriptions of meals.",
                  "I’m not comfortable logging meals.",
                  "I’m not sure, but I’d like to learn more.",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setMealLoggingComfort(option);
                      setShowMealLoggingMenu(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              <Text style={styles.label}>
                How would you rate your current physical health?
              </Text>
              <Menu
                visible={showPhysicalMenu}
                onDismiss={() => setShowPhysicalMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowPhysicalMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: physicalHealth ? "#000" : "#888" }}>
                      {physicalHealth || "Select your physical health"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Very poor",
                  "Poor",
                  "Average",
                  "Good",
                  "Excellent",
                  "Prefer not to say",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setPhysicalHealth(option);
                      setShowPhysicalMenu(false);
                    }}
                    title={option}
                  />
                ))}
              </Menu>

              <Text style={styles.label}>
                Would you like to see calorie info?
              </Text>
              <Menu
                visible={showCalorieMenu}
                onDismiss={() => setShowCalorieMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowCalorieMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text
                      style={{ color: caloriePreference ? "#000" : "#888" }}
                    >
                      {caloriePreference || "Select your preference"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Yes, I’d like to see calories.",
                  "No, I’d prefer not to see calories.",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setCaloriePreference(option);
                      setShowCalorieMenu(false);
                    }}
                  />
                ))}
              </Menu>

              <Text style={styles.label}>
                Would you like to see macro info?
              </Text>
              <Menu
                visible={showMacroMenu}
                onDismiss={() => setShowMacroMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowMacroMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: macroPreference ? "#000" : "#888" }}>
                      {macroPreference || "Select your preference"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Yes, I’d like to see macros.",
                  "No, I’d prefer not to see macros.",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setMacroPreference(option);
                      setShowMacroMenu(false);
                    }}
                  />
                ))}
              </Menu>

              <Text style={styles.label}>Reminders Frequency</Text>
              <Menu
                visible={showReminderMenu}
                onDismiss={() => setShowReminderMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowReminderMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text
                      style={{ color: remindersFrequency ? "#000" : "#888" }}
                    >
                      {remindersFrequency || "Select your reminder frequency"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "None (I’ll check in manually)",
                  "Minimal (once per day)",
                  "Standard (2–3 times per day)",
                  "Frequent (several times per day)",
                  "Not sure, will adjust later",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setRemindersFrequency(option);
                      setShowReminderMenu(false);
                    }}
                  />
                ))}
              </Menu>
              <Text style={styles.label}>
                Do you experience anxiety around food?
              </Text>
              <Menu
                visible={showFoodAnxietyMenu}
                onDismiss={() => setShowFoodAnxietyMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowFoodAnxietyMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: anxiousFood ? "#000" : "#888" }}>
                      {foodAnxietyLevel || "Select your response"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Yes, I often feel anxious",
                  "Sometimes, but it's manageable",
                  "Rarely, but it's there",
                  "No, I don't feel anxious",
                  "Prefer not to say",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setAnxiousFood(option);
                      setShowFoodAnxietyMenu(false);
                    }}
                  />
                ))}
              </Menu>

              <Text style={styles.label}>
                Are you interested in a regular mood check-in to adapt recipes
                and fitness suggestions?
              </Text>
              <Menu
                visible={showMoodCheckInMenu}
                onDismiss={() => setShowMoodCheckInMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowMoodCheckInMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: moodCheckIn ? "#000" : "#888" }}>
                      {moodCheckIn || "Select your preference"}
                    </Text>
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

              <Text style={styles.label}>
                Do you want access to mental health resources (hotlines,
                articles, etc.) in the app?
              </Text>
              <Menu
                visible={showMentalResourcesMenu}
                onDismiss={() => setShowMentalResourcesMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowMentalResourcesMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text
                      style={{ color: mentalHealthResouces ? "#000" : "#888" }}
                    >
                      {mentalHealthResouces || "Select your preference"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Yes, please show me available resources.",
                  "Not right now.",
                  "Not sure, remind me later.",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setMentalHealthResouces(option);
                      setShowMentalResourcesMenu(false);
                    }}
                  />
                ))}
              </Menu>

              <Text style={styles.label}>
                Would you like us to adjust the app to minimize triggers (e.g.,
                hiding calorie counts, providing gentle prompts instead of
                strict daily targets)?
              </Text>
              <Menu
                visible={showTriggerMenu}
                onDismiss={() => setShowTriggerMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowTriggerMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: hideTriggers ? "#000" : "#888" }}>
                      {hideTriggers || "Select your preference"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Yes, please hide numeric data when possible.",
                  "I’m okay with seeing all data.",
                  "I’m not sure, let me decide later in Settings.",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setHideTriggers(option);
                      setShowTriggerMenu(false);
                    }}
                  />
                ))}
              </Menu>
              <Text style={styles.label}>
                How would you describe your relationship with movement or
                exercise?
              </Text>
              <Menu
                visible={showmovementMenu}
                onDismiss={() => setShowMovementMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowMovementMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text
                      style={{ color: movementRelationship ? "#000" : "#888" }}
                    >
                      {movementRelationship || "Select your response"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {[
                  "Joyful & energizing",
                  "Neutral or routine",
                  "Stressful or overwhelming",
                  "Still figuring it out",
                  "Prefer not to say",
                ].map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setMovementRelationship(option);
                      setShowMovementMenu(false);
                    }}
                  />
                ))}
              </Menu>
              <Text style={styles.label}>
                How would you like the app's tone to feel?
              </Text>
              <Menu
                visible={showToneMenu}
                onDismiss={() => setShowToneMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowToneMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: tonePreference ? "#000" : "#888" }}>
                      {tonePreference || "Select your preference"}
                    </Text>
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
              <Text style={styles.label}>
                Are there any topics you'd like to avoid seeing?
              </Text>
              <Menu
                visible={showContentMenu}
                onDismiss={() => setShowContentMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowContentMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: contentAvoidance ? "#000" : "#888" }}>
                      {contentAvoidance || "Select your response"}
                    </Text>
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
              <Text style={styles.label}>
                Would you like the app to suggest coping tools when you're
                struggling?
              </Text>
              <Menu
                visible={showCopingMenu}
                onDismiss={() => setShowCopingMenu(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setShowCopingMenu(true)}
                    style={styles.dropdown}
                  >
                    <Text style={{ color: copingConsent ? "#000" : "#888" }}>
                      {copingConsent || "Select your response"}
                    </Text>
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
              <Text style={styles.label}>
                Anything else you'd like us to know about you or your needs?
              </Text>
              <TextInput
                style={styles.input}
                value={userNotes}
                onChangeText={setUserNotes}
                placeholder="Optional — share anything you’d like"
              />
            </View>
          ) : (
            <Text style={{ fontStyle: "italic", marginBottom: 10 }}>
              Complete the screening quiz to unlock advance settings.
            </Text>
          )}

          <BasicButton onPress={handleSave}>
            <Text style={{ color: "black" }}>Save Changes</Text>
          </BasicButton>
          <Portal>
            <Modal
              visible={confirmDelete}
              onDismiss={() => setConfirmDelete(false)}
              contentContainerStyle={styles.confirmModal}
            >
              <Text style={styles.modalTitle}>Are you sure?</Text>
              <Text style={styles.modalText}>
                This will permanently delete your account and all saved data.
                There's no undo.
              </Text>
              <Button
                mode="contained"
                onPress={handleDeleteAccount}
                style={[styles.authButton, { backgroundColor: "#f8d7da" }]}
              >
                Yes, delete my account
              </Button>
              <Button onPress={() => setConfirmDelete(false)}>Cancel</Button>
            </Modal>
          </Portal>
        </ScrollView>
        <View style={styles.buttons}>
          <Button onPress={() => setConfirmDelete(true)}>Delete Account</Button>
          <Button onPress={handleLogout}>Logout</Button>
          <Button onPress={handleResetPassword}>Reset Password</Button>
          <Button onPress={resetOnboarding}>Reset</Button>
        </View>
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
  buttonText: {
    fontSize: 10,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  confirmModal: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Comfortaa-Regular",
    color: "#180c37",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Main-font",
    color: "#333",
  },
  authButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    justifyContent: "center",
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
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
});
