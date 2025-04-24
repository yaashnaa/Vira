import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import { Menu, List, Divider } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Header as HeaderRNE } from "@rneui/themed";
export default function DietMovementScreen() {
  const { userPreferences, updatePreferences } = useUserPreferences();
  const router = useRouter();
  const [dietPreferences, setDietPreferences] = useState<string[]>(
    userPreferences.dietaryPreferences ?? []
  );
  const [customDiet, setCustomDiet] = useState(
    (userPreferences.customDietaryPreferences ?? []).join(", ")
  );
  const [mealLoggingComfort, setMealLoggingComfort] = useState(
    userPreferences.mealLogging
  );
  const [caloriePreference, setCaloriePreference] = useState(
    userPreferences.caloriePreference ?? ""
  );
  const [macroPreference, setMacroPreference] = useState(
    userPreferences.macroPreference ?? ""
  );
  const [movementRelationship, setMovementRelationship] = useState(
    userPreferences.movementRelationship ?? ""
  );
  const [physicalHealth, setPhysicalHealth] = useState(
    userPreferences.physicalHealth ?? ""
  );

  // Menu visibility
  const [showMealLoggingMenu, setShowMealLoggingMenu] = useState(false);
  const [showCalorieMenu, setShowCalorieMenu] = useState(false);
  const [showMacroMenu, setShowMacroMenu] = useState(false);
  const [showMovementMenu, setShowMovementMenu] = useState(false);
  const [showPhysicalMenu, setShowPhysicalMenu] = useState(false);
  const [showDietMenu, setShowDietMenu] = useState(false);
  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const updates = {
        ...userPreferences,
        physicalHealth,
        calorieViewing: caloriePreference === "Yes, I’d like to see calories.",
        macroViewing: macroPreference === "Yes, I’d like to see macros.",
        caloriePreference,
        macroPreference,
        dietPreferences,
        customDietaryPreferences: customDiet
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        mealLogging: mealLoggingComfort,
        movementRelationship,
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
        Toast.show({
            type: "error",
            text1: "Error Saving Preferences",
            text2: "Something went wrong while saving your preferences.",
            position: "bottom",
        });
    }
  };

  return (
    <>
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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Dietary Preferences</Text>
        <Menu
          visible={showDietMenu}
          onDismiss={() => setShowDietMenu(false)}
          contentStyle={{ backgroundColor: "#f7f0ff", width: "100%" }}
          anchor={
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDietMenu(true)}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {dietPreferences.length > 0
                    ? dietPreferences.join(", ")
                    : "Select your dietary preferences"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
              </View>
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
              // contentStyle={{ backgroundColor: "#f7f1ff"}}
              titleStyle={{ color: "#0e0e0e" }}
              title={
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {dietPreferences.includes(option) && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#212121"
                      style={{ marginRight: 8 }}
                    />
                  )}
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
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>
          Are you comfortable logging your meals?
        </Text>
        <Menu
          visible={showMealLoggingMenu}
          contentStyle={{ backgroundColor: "#f7f0ff", width: "100%" }}
          onDismiss={() => setShowMealLoggingMenu(false)}
          anchor={
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowMealLoggingMenu(true)} // Replace with the corresponding setShow function
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {mealLoggingComfort || "Select an option"}{" "}
                  {/* Replace accordingly */}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#383838" />
              </View>
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
              titleStyle={{ color: "#2a2a2a" }}
              title={option}
              onPress={() => {
                setMealLoggingComfort(option);
                setShowMealLoggingMenu(false);
              }}
            />
          ))}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>Would you like to see calorie info?</Text>
        <Menu
          visible={showCalorieMenu}
          contentStyle={{ backgroundColor: "#f7f0ff", width: "100%" }}
          onDismiss={() => setShowCalorieMenu(false)}
          anchor={
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCalorieMenu(true)}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {caloriePreference || "Select your preference"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
              </View>
            </TouchableOpacity>
          }
        >
          {[
            "Yes, I’d like to see calories.",
            "No, I’d prefer not to see calories.",
          ].map((option) => (
            <Menu.Item
              key={option}
              // contentStyle={{ backgroundColor: "#f7f1ff"}}
              titleStyle={{ color: "#0e0e0e" }}
              title={option}
              onPress={() => {
                setCaloriePreference(option);
                setShowCalorieMenu(false);
              }}
            />
          ))}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>Would you like to see macro info?</Text>
        <Menu
          contentStyle={{ backgroundColor: "#f7f0ff", width: "100%" }}
          visible={showMacroMenu}
          onDismiss={() => setShowMacroMenu(false)}
          anchor={
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowMacroMenu(true)}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {macroPreference || "Select your preference"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
              </View>
            </TouchableOpacity>
          }
        >
          {[
            "Yes, I’d like to see macros.",
            "No, I’d prefer not to see macros.",
          ].map((option) => (
            <Menu.Item
              key={option}
              // contentStyle={{ backgroundColor: "#f7f1ff"}}
              titleStyle={{ color: "#0e0e0e" }}
              title={option}
              onPress={() => {
                setMacroPreference(option);
                setShowMacroMenu(false);
              }}
            />
          ))}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>Relationship with Movement</Text>
        <Menu
          visible={showMovementMenu}
          onDismiss={() => setShowMovementMenu(false)}
          contentStyle={{ backgroundColor: "#f7f0ff", width: "100%" }}
          anchor={
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowMovementMenu(true)}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {movementRelationship || "Select your response"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
              </View>
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
              // contentStyle={{ backgroundColor: "#f7f1ff"}}
              titleStyle={{ color: "#0e0e0e" }}
              title={option}
              onPress={() => {
                setMovementRelationship(option);
                setShowMovementMenu(false);
              }}
            />
          ))}
        </Menu>
        <Divider style={{ marginVertical: 18 }} />
        <Text style={styles.label}>
          How would you rate your physical health?
        </Text>
        <Menu
          visible={showPhysicalMenu}
          onDismiss={() => setShowPhysicalMenu(false)}
          anchor={
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowPhysicalMenu(true)}
            >
              <View style={styles.dropdownRow}>
                <Text style={styles.dropdownText}>
                  {physicalHealth || "Select your health level"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#5a5a5a" />
              </View>
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
              // contentStyle={{ backgroundColor: "#f7f1ff"}}
              titleStyle={{ color: "#0e0e0e" }}
              title={option}
              onPress={() => {
                setPhysicalHealth(option);
                setShowPhysicalMenu(false);
              }}
            />
          ))}
        </Menu>
        <Button
          mode="contained"
          onPress={handleSave}
          style={{
            marginTop: 24,
            backgroundColor: "#7550a7",
            borderRadius: 8,
          }}
          contentStyle={{ paddingVertical: 6 }}
          labelStyle={{
            fontFamily: "Main-font",
            color: "#fff",
            fontSize: 16,
          }}
        >
          Save Changes
        </Button>
      </ScrollView>
    </>
  );
}
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    height: height,
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
    // borderWidth: 1,
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
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
