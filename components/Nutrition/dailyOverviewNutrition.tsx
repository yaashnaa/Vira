import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { auth, db } from "@/config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import dayjs from "dayjs";
import { useMealLog } from "@/context/mealLogContext";

export default function DailyOverviewNutrition({
  totalMeals,
  calories,
  protein,
  carbs,
  fat,
  mood,
}: {
  totalMeals: number;
  mealsLogged: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mood: string;
}) {
  const { userPreferences } = useUserPreferences();
  const [mealsLogged, setMealsLogged] = useState(0);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const { refreshFlag } = useMealLog();

  const fetchTodayNutrition = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const startOfDay = dayjs().startOf("day").toDate();
      const endOfDay = dayjs().endOf("day").toDate();

      const mealsRef = collection(db, "users", uid, "meals");
      const q = query(
        mealsRef,
        where("timestamp", ">=", Timestamp.fromDate(startOfDay)),
        where("timestamp", "<=", Timestamp.fromDate(endOfDay))
      );

      const querySnapshot = await getDocs(q);
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        calories += data.calories ?? 0;
        protein += data.protein ?? 0;
        carbs += data.carbs ?? 0;
        fat += data.fat ?? 0;
      });

      setMealsLogged(querySnapshot.size);
      setTotals({ calories, protein, carbs, fat });
    } catch (err) {
      console.error("🔥 Error fetching daily nutrition from Firestore:", err);
    }
  };

  useEffect(() => {
    fetchTodayNutrition();
  }, [refreshFlag]);

  const progress = totalMeals > 0 ? mealsLogged / totalMeals : 0;
  const formattedCalories = Intl.NumberFormat().format(totals.calories);

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Title title="💡 Today’s Summary" titleStyle={{ color: "black" }} />
      <Card.Content>
        <Text style={styles.label}>
          Meals logged:{" "}
          {totalMeals === 0 ? `${mealsLogged}` : `${mealsLogged}/${totalMeals}`}
        </Text>

        <ProgressBar progress={progress} color="#A084DC" style={styles.bar} />

        {(userPreferences.calorieViewing || userPreferences.macroViewing) && (
          <>
            {userPreferences.calorieViewing && (
              <Text style={styles.label}>
                Calories:{" "}
                {Intl.NumberFormat().format(Math.round(totals.calories))} kcal
              </Text>
            )}
            {userPreferences.macroViewing && (
              <View style={styles.macroContainer}>
                <Text style={styles.macroText}>
                  Protein: {Math.round(totals.protein)}g
                </Text>
                <Text style={styles.macroText}>
                  Carbs: {Math.round(totals.carbs)}g
                </Text>
                <Text style={styles.macroText}>
                  Fat: {Math.round(totals.fat)}g
                </Text>
              </View>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    width: "100%",
  },
  label: {
    marginBottom: 8,
    color: "#666",
    fontSize: 16,
  },
  bar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  macroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  macroText: {
    fontSize: 14,
    color: "#666",
  },
});
