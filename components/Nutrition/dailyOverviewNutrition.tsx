import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Dimensions } from "react-native";
import { Card, Text, ProgressBar, Button } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useMealLog } from "@/context/mealLogContext";
import CircularProgress from "react-native-circular-progress-indicator";
import CalorieGoalsModal from "./goalsModal";
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
  const { refreshFlag } = useMealLog();
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
    macroUnit: "percent", // 🆕
  });
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const hasNutritionGoals =
    goals.calories &&
    goals.protein &&
    goals.carbs &&
    goals.fat &&
    goals.macroUnit;

  const fetchGoals = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const docRef = doc(db, "users", uid, "preferences", "nutritionGoals");
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.calorieGoal && data.macroSplit) {
        setGoals({
          calories: data.calorieGoal?.toString(),
          protein: data.macroSplit?.protein?.toString(),
          carbs: data.macroSplit?.carbs?.toString(),
          fat: data.macroSplit?.fat?.toString(),
          meals: String(data.plannedMeals || "3"),
          mindfulGoal: data.mindfulGoal || "",
          macroUnit: data.macroUnit || "percent",
        });
      } else {
        setGoals({
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          meals: String(data.plannedMeals || "3"),
          mindfulGoal: data.mindfulGoal || "",
          macroUnit: "",
        });
      }
    }
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
              {/* Calories */}
              {userPreferences.calorieViewing && goals.calories && (
                <Text style={styles.label}>
                  Calories: {Math.round(totals.calories)} / {goals.calories}{" "}
                  kcal
                </Text>
              )}

              {/* Macros */}
              {userPreferences.macroViewing && hasNutritionGoals ? (
                <>
                  {goals.calories &&
                  goals.macroUnit &&
                  goals.protein &&
                  goals.carbs &&
                  goals.fat ? (
                    <>
                      {/* Circular Progress Bars */}
                      <View style={styles.circularContainer}>
                        {["protein", "carbs", "fat"].map((macro) => (
                          <View style={styles.circleWrapper} key={macro}>
                            <CircularProgress
                              value={
                                goals.macroUnit === "percent"
                                  ? Math.min(
                                      (totals[macro as keyof typeof totals] /
                                        ((parseFloat(goals.calories) *
                                          (parseFloat(
                                            goals[macro as keyof typeof goals]
                                          ) /
                                            100)) /
                                          (macro === "fat" ? 9 : 4))) *
                                        100,
                                      100
                                    )
                                  : Math.min(
                                      (totals[macro as keyof typeof totals] /
                                        parseFloat(
                                          goals[macro as keyof typeof goals]
                                        )) *
                                        100,
                                      100
                                    )
                              }
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
                        ))}
                      </View>

                      {/* Macro Grams (Outside CircularContainer) */}
                      <View style={styles.macrosGramsContainer}>
                        <Text style={styles.macroGramsTitle}>
                          Macro Consumption Today:
                        </Text>
                        <View style={styles.pillsRow}>
                          <View
                            style={[
                              styles.macroPill,
                              { backgroundColor: "#FEE2E2" },
                            ]}
                          >
                            <Text style={styles.pillText}>
                              🍗 {Math.round(totals.protein)}g
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.macroPill,
                              { backgroundColor: "#E0F2FE" },
                            ]}
                          >
                            <Text style={styles.pillText}>
                              🍞 {Math.round(totals.carbs)}g
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.macroPill,
                              { backgroundColor: "#FEF3C7" },
                            ]}
                          >
                            <Text style={styles.pillText}>
                              🧈 {Math.round(totals.fat)}g
                            </Text>
                          </View>
                        </View>
                      </View>
                    </>
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 10,
                        color: "#777",
                      }}
                    >
                      Set your nutrition goals to see progress!
                    </Text>
                  )}
                </>
              ) : (
                <Text
                  style={{ textAlign: "center", marginTop: 10, color: "#777" }}
                >
                  Set your nutrition goals to see progress!
                </Text>
              )}

              <Button
                mode="contained"
                onPress={() => setGoalModalVisible(true)}
                style={{ marginTop: 20 }}
              >
                🎯 Set Nutrition Goals
              </Button>
            </>
          ) : (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.mindfulText}>
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
  mindfulText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
  },
  circularContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  circleWrapper: {
    alignItems: "center",
  },
  macrosGramsContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  macroGramsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  macroPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    color: "#333",
  },
});
