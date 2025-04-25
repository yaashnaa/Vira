import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import DailyOverviewNutrition from "@/components/Nutrition/dailyOverviewNutrition";
import { useUserPreferences } from "@/context/userPreferences";
import { fetchMealLogs } from "@/utils/firestore";
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import ViewLoggedMeals from "@/components/Nutrition/viewLoggedMeals";

export default function Recipes() {
  const { userPreferences } = useUserPreferences();
  const [modalVisible, setModalVisible] = useState(false);
  const [mealsLogged, setMealsLogged] = useState(0);
  const [searchModal, setSearchModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState("log");
  const [value, setValue] = React.useState("");
  const [totalMeals, setTotalMeals] = useState(3);

  const uid = auth.currentUser?.uid;
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [mealMood, setMealMood] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const router = useRouter();
  const [meals, setMeals] = useState<any[]>([]);
  useEffect(() => {
    const loadMeals = async () => {
      if (uid) {
        const meals: {
          id: string;
          nutrition?: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
          };
        }[] = await fetchMealLogs(uid);
        setMealsLogged(meals.length);

        // Update nutrition totals from meals
        const totals = meals.reduce(
          (acc, meal) => {
            return {
              calories: acc.calories + (meal.nutrition?.calories || 0),
              protein: acc.protein + (meal.nutrition?.protein || 0),
              carbs: acc.carbs + (meal.nutrition?.carbs || 0),
              fat: acc.fat + (meal.nutrition?.fat || 0),
            };
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        setNutritionTotals(totals);
      }
    };
    loadMeals();
  }, [uid]);

  const handleBackPress = () => {
    router.replace("/dashboard");
  };
  return (
    <>
      <View style={styles.container}>
          <DailyOverviewNutrition
            totalMeals={totalMeals}
            calories={nutritionTotals.calories}
            protein={nutritionTotals.protein}
            carbs={nutritionTotals.carbs}
            fat={nutritionTotals.fat}
            mood={mealMood}
            refreshFlag={refreshFlag}
          />
        <ViewLoggedMeals />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 12,
    fontFamily: "PatrickHand-Regular",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Main-font",
    color: "#888",
  },
  mealCard: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f7f5ff",
    borderRadius: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Main-font",
  },
  mealDetail: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#555",
    marginTop: 2,
  },
  mealMood: {
    fontSize: 13,
    fontFamily: "Main-font",
    color: "#7c5e99",
    marginTop: 4,
  },
});
