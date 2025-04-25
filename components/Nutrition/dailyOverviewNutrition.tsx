import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Dimensions } from "react-native";
import {
  Card,
  Text,
  ProgressBar,
  Button,
  Portal,
  Modal,
} from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { auth, db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import dayjs from "dayjs";
import { useMealLog } from "@/context/mealLogContext";
import Toast from "react-native-toast-message";
import CalorieGoalsModal from "./goalsModal";
import CircularProgress from "react-native-circular-progress-indicator";
import { fetchMealsAndTotals } from "@/utils/fetchMealsAndTotals";
export default function DailyOverviewNutrition({
  totalMeals,
  calories,
  protein,
  carbs,
  fat,
  mood,
}: {
  totalMeals: number;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mood: string;
  refreshFlag: boolean;
}) {
  const { userPreferences } = useUserPreferences();
  const [mealsLogged, setMealsLogged] = useState(0);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [goals, setGoals] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    meals: "",
    mindfulGoal: "",
  });
  const [editing, setEditing] = useState(false);
  const { refreshFlag } = useMealLog();
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");
  const [carbsGoal, setCarbsGoal] = useState("");
  const [fatGoal, setFatGoal] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [mealGoal, setMealGoal] = useState("");
  const messages = [
    "🌿 Nourishment over numbers. You're doing great!",
    "💬 Your body deserves kindness every day.",
    "🌟 Mindful eating is powerful progress.",
    "🍀 You are more than a number on a scale.",
  ];

  const fetchGoals = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const docRef = doc(db, "users", uid, "preferences", "nutritionGoals");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      setGoals({
        calories: data.calorieGoal?.toString() || "2000",
        protein: data.macroSplit?.protein?.toString() || "20",
        carbs: data.macroSplit?.carbs?.toString() || "50",
        fat: data.macroSplit?.fat?.toString() || "30",
        meals: String(data.plannedMeals || "3"),
        mindfulGoal: data.mindfulGoal || "",
      });
    }
  };

  const saveGoals = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const docRef = doc(db, "users", uid, "preferences", "nutritionGoals");
    // await setDoc(docRef, {
    //   calorieGoal: Number(calorieGoal),
    //   macroSplit: {
    //     protein: Number(protein),
    //     carbs: Number(carbs),
    //     fat: Number(fat),
    //   },
    //   plannedMeals: Number(meals),
    //   mindfulGoal:
    //     selectedGoal === "Custom Goal" ? customGoal.trim() : selectedGoal,
    // });

    setEditing(false);
  };

  const handleChange = (field: keyof typeof goals, value: string) => {
    setGoals({ ...goals, [field]: value });
    Toast.show({
      type: "success",
      text1: "Goal updated!",

      position: "bottom",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const fetchTodayNutrition = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const { mealsLogged, totals } = await fetchMealsAndTotals(uid);

      setMealsLogged(mealsLogged);
      setTotals(totals);
    } catch (err) {
      console.error("🔥 Error fetching nutrition:", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    fetchTodayNutrition();
  }, [refreshFlag]);
  return (
    <>
      <Card style={styles.card}>
        <Card.Title title="💡 Today’s Summary" titleStyle={{ color: "#000" }} />
        <Card.Content>
          <Text style={styles.label}>
            Meals logged: {mealsLogged}/{goals.meals || "3"}
          </Text>
          <ProgressBar
            progress={
              goals.meals
                ? Math.min(mealsLogged / parseInt(goals.meals || "1"), 1)
                : 0
            }
            style={styles.bar}
            color="#A084DC"
          />

          {userPreferences.calorieViewing || userPreferences.macroViewing ? (
            <>
              {userPreferences.calorieViewing && (
                <View style={styles.goalRow}>
                  <Text style={styles.label}>
                    Calories: {Math.round(totals.calories)} kcal
                  </Text>
                  {editing ? (
                    <TextInput
                      placeholder="Goal"
                      keyboardType="numeric"
                      value={goals.calories}
                      onChangeText={(val) => handleChange("calories", val)}
                      style={styles.input}
                    />
                  ) : (
                    goals.calories && (
                      <Text style={styles.goalText}>
                        Goal: {goals.calories} kcal
                      </Text>
                    )
                  )}
                </View>
              )}
              {userPreferences.macroViewing && (
                <>
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    {["calories", "protein", "carbs", "fat"].map((macro) => (
                      <View
                        style={{
                          alignItems: "center",
                          marginBottom: 20,
                          display: "flex",
                          flexDirection: "row",
                        }}
                        key={macro}
                      >
                        <View
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            width: 80,
                          }}
                        >
                          <CircularProgress
                            value={Math.min(
                              (totals[macro as keyof typeof totals] /
                                parseFloat(
                                  goals[macro as keyof typeof goals] || "1"
                                )) *
                                100,
                              100
                            )}
                            radius={30}
                            valueSuffix="%"
                            inActiveStrokeOpacity={0.5}
                            progressValueColor={"#444"}
                            maxValue={100}
                            activeStrokeWidth={5}
                            inActiveStrokeWidth={5}
                            inActiveStrokeColor="#939393"
                            activeStrokeColor={"#775bb5"}
                            progressValueFontSize={12}
                            title={
                              macro.charAt(0).toUpperCase() + macro.slice(1)
                            }
                            titleColor={"#222222"}
                            titleStyle={{
                              fontSize: 10,
                              fontFamily: "Main-font",
                            }}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                  {["protein", "carbs", "fat"].map((macro) => (
                    <View style={styles.goalRow} key={macro}>
                      <Text style={styles.label}>
                        {macro.charAt(0).toUpperCase() + macro.slice(1)}:{" "}
                        {Math.round(totals[macro as keyof typeof totals])}g
                      </Text>
                      {editing ? (
                        <TextInput
                          placeholder="Goal"
                          keyboardType="numeric"
                          value={goals[macro as keyof typeof goals]}
                          onChangeText={(val) =>
                            handleChange(macro as keyof typeof goals, val)
                          }
                          style={styles.input}
                        />
                      ) : (
                        goals[macro as keyof typeof goals] && (
                          <Text style={styles.goalText}>
                            Goal: {goals[macro as keyof typeof goals]}g
                          </Text>
                        )
                      )}
                    </View>
                  ))}
                </>
              )}
              <Button
                mode="contained"
                onPress={() => setGoalModalVisible(true)}
                style={{ marginBottom: 12 }}
              >
                🎯 Set Nutrition Goals
              </Button>
            </>
          ) : (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: "#666",
                  fontStyle: "italic",
                  marginTop: 10,
                }}
              >
                {goals.mindfulGoal
                  ? `🌟 Your goal: ${goals.mindfulGoal}`
                  : "🌟 You’re focusing on mindful eating today. Keep it up!"}
              </Text>

              <Button
                mode="contained"
                onPress={() => setGoalModalVisible(true)}
                style={{ marginTop: 16 }}
              >
                Set Optional Goals
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      <CalorieGoalsModal
        visible={goalModalVisible}
        onGoalsSaved={() => fetchGoals()}
        onClose={() => setGoalModalVisible(false)}
      />
    </>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    width: width * 0.9,
    // margin: "auto",
    // alignItems: "center",
    // justifyContent: "center",
  },
  inputCont: {
    marginBottom: 10,
    // borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    width: "100%",
    color: "#000",
    textAlign: "center",
    gap: 10,
  },
  label: {
    marginBottom: 6,
    color: "#444",
    fontSize: 14,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    width: 80,
    color: "#e53232",
    textAlign: "center",
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  goalText: {
    fontSize: 14,
    color: "#666",
  },
});
