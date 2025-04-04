import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";

interface Props {
  mealsLogged: number;
  totalMeals: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mood?: string;
}

export default function DailyOverviewNutrition({
  mealsLogged,
  totalMeals,
  calories,
  protein,
  carbs,
  fat,
  mood,
}: Props) {
  const { userPreferences } = useUserPreferences();

  const progress = totalMeals > 0 ? mealsLogged / totalMeals : 0;
  const formattedCalories = calories
    ? Intl.NumberFormat().format(calories)
    : "0";

  return (
    <Card style={styles.card}>
      <Card.Title title="💡 Today’s Summary" />
      <Card.Content>
        <Text style={styles.label}>
          Meals logged: {totalMeals === 0 ? "No meals added yet" : `${mealsLogged} of ${totalMeals}`}
        </Text>

        <ProgressBar progress={progress} color="#A084DC" style={styles.bar} />

        {userPreferences.calorieViewing && (
          <Text style={styles.label}>Calories: {formattedCalories} kcal</Text>
        )}

        {userPreferences.macroViewing && (
          <View style={styles.macroContainer}>
            <Text style={styles.macroText}>Protein: {protein ?? 0}g</Text>
            <Text style={styles.macroText}>Carbs: {carbs ?? 0}g</Text>
            <Text style={styles.macroText}>Fat: {fat ?? 0}g</Text>
          </View>
        )}

        {userPreferences.moodcCheckInBool && mood?.trim() !== "" && (
          <Text style={styles.label}>🧠 Mood after meals: {mood}</Text>
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
    elevation: 2,
  },
  label: {
    marginBottom: 8,
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
