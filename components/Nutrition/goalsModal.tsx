import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { db, auth } from "@/config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";

export default function CalorieGoalsModal({
  visible,
  onClose,
  onGoalsSaved,
}: {
  visible: boolean;
  onClose: () => void;
  onGoalsSaved: () => void;
}) {
  const { userPreferences } = useUserPreferences();
  const presetGoals = [
    "I want to eat without guilt.",
    "I want to feel nourished and satisfied.",
    "I want to listen to my body's needs.",
    "I want to build a healthy relationship with food.",
    "I want to eat with intention and joy.",
    "Custom Goal",
  ];
  const [selectedGoal, setSelectedGoal] = useState(presetGoals[0]);
  const [customGoal, setCustomGoal] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [protein, setProtein] = useState("20");
  const [carbs, setCarbs] = useState("50");
  const [fat, setFat] = useState("30");
  const [meals, setMeals] = useState("3");
  const [customMindfulGoal, setCustomMindfulGoal] = useState("");

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const docRef = doc(db, "users", uid, "preferences", "nutritionGoals");

    if (userPreferences.calorieViewing || userPreferences.macroViewing) {
      // Save nutrition-related goals
      await setDoc(docRef, {
        calorieGoal: Number(calorieGoal),
        macroSplit: {
          protein: Number(protein),
          carbs: Number(carbs),
          fat: Number(fat),
        },
        plannedMeals: Number(meals),
        goal: selectedGoal === "Custom Goal" ? customGoal.trim() : selectedGoal,
      });
    } else {
      // Save mindful eating goal
      await setDoc(docRef, {
        mindfulGoal: customMindfulGoal || "Practice mindful eating",
        calorieGoal: null,
        macroSplit: null,

        plannedMeals: Number(meals) || 3,
      });
    }

    onGoalsSaved();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        android_disableSound={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoiding}
        >
          <Pressable
            style={styles.modal}
            onPress={() => {}}
            android_disableSound={true}
          >
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.title}>
                🎯{" "}
                {userPreferences.calorieViewing || userPreferences.macroViewing
                  ? "Set Your Daily Nutrition Goals"
                  : "Set Your Mindful Eating Goal"}
              </Text>

              {userPreferences.calorieViewing ||
              userPreferences.macroViewing ? (
                <>
                  <TextInput
                    placeholder="Calories (e.g., 2000)"
                    value={calorieGoal}
                    keyboardType="numeric"
                    onChangeText={setCalorieGoal}
                    style={styles.input}
                  />

                  <Text style={styles.label}>Macronutrient % Split</Text>
                  <TextInput
                    placeholder="Protein %"
                    value={protein}
                    keyboardType="numeric"
                    onChangeText={setProtein}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Carbs %"
                    value={carbs}
                    keyboardType="numeric"
                    onChangeText={setCarbs}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Fat %"
                    value={fat}
                    keyboardType="numeric"
                    onChangeText={setFat}
                    style={styles.input}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.label}>🧘 Mindful Eating Goal</Text>
                  {presetGoals.map((goal) => (
                    <Pressable
                      key={goal}
                      style={[
                        styles.goalOption,
                        selectedGoal === goal && styles.selectedOption,
                      ]}
                      onPress={() => setSelectedGoal(goal)}
                    >
                      <Text style={styles.goalOptionText}>{goal}</Text>
                    </Pressable>
                  ))}
                </>
              )}

              <Text style={styles.label}>🍽️ Meals Planned</Text>
              <TextInput
                placeholder="e.g. 3"
                value={meals}
                keyboardType="numeric"
                onChangeText={setMeals}
                style={styles.input}
              />

              {selectedGoal === "Custom Goal" && (
                <TextInput
                  placeholder="Write your own goal..."
                  value={customGoal}
                  onChangeText={setCustomGoal}
                  style={styles.input}
                />
              )}

              <View style={styles.buttonRow}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveBtn}
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={styles.cancelBtn}
                >
                  Cancel
                </Button>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  keyboardAvoiding: {
    width: "100%",
    maxWidth: 400,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
    marginBottom: 10,
    color: "#3e2a6e",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveBtn: {
    flex: 1,
    marginRight: 8,
  },
  cancelBtn: {
    flex: 1,
  },
  goalOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedOption: {
    backgroundColor: "#e2d4f0",
    borderColor: "#A084DC",
  },
  goalOptionText: {
    fontSize: 14,
    color: "#333",
  },
});
