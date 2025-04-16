import React, { useState, useEffect } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { db } from "@/config/firebaseConfig";
import {
  Text,
  Card,
  Button,
  Divider,
  useTheme,
  Appbar,
  SegmentedButtons,
} from "react-native-paper";
import { fetchMealLogs } from "@/utils/firestore"; // adjust path

import { auth } from "@/config/firebaseConfig";

import { Header as HeaderRNE, HeaderProps, Icon } from "@rneui/themed";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import DailyOverviewNutrition from "@/components/Nutrition/dailyOverviewNutrition";
import { useUserPreferences } from "@/context/userPreferences";
import { useRouter } from "expo-router";
import LogMealCardModal from "@/components/Nutrition/logMeal";
import SuggestMeals from "@/components/Nutrition/suggestMeals";
import NutritionSearch from "@/components/Nutrition/searchNutrionalInfo";
import ViewLoggedMeals from "@/components/Nutrition/viewLoggedMeals";

export default function NutritionScreen() {
  const { userPreferences } = useUserPreferences();
  const [modalVisible, setModalVisible] = useState(false);
  const [mealsLogged, setMealsLogged] = useState(0);
  const [searchModal, setSearchModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState("log");
  const [value, setValue] = React.useState("");
  const [totalMeals] = useState(3);
  const theme = useTheme();
  const uid = auth.currentUser?.uid;
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [mealMood, setMealMood] = useState("");

  const router = useRouter();
  useEffect(() => {
    const loadMeals = async () => {
      if (uid) {
        const meals: { id: string; nutrition?: { calories: number; protein: number; carbs: number; fat: number } }[] = await fetchMealLogs(uid);
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
  const handleLog = async ({ nutrition, mood, name }: any) => {
    setMealMood(mood);
    const uid = auth.currentUser?.uid;
  
    if (uid) {
      await addDoc(collection(db, "users", uid, "meals"), {
        name,
        nutrition,
        mood,
        timestamp: Timestamp.now(),
      });
  
      const meals = await fetchMealLogs(uid);
      setMealsLogged(meals.length); // refresh view
    }
  };
  const handleBackPress = () => {
    router.replace("/dashboard");
  };
  const renderHeader = () => (
    <>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb", 
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#231313" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "NUTRITION",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => router.push("/settings")}
            >
              <Icon name="settings" size={25} type="feather" color="#231313" />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView style={styles.container}>
        <Text style={styles.greeting}>
          Hello, {userPreferences?.name || "friend"} 🥗
        </Text>

        {(userPreferences?.calorieViewing || userPreferences?.macroViewing) && (
          <View>
            <DailyOverviewNutrition
              mealsLogged={mealsLogged}
              totalMeals={totalMeals}
              calories={nutritionTotals.calories}
              protein={nutritionTotals.protein}
              carbs={nutritionTotals.carbs}
              fat={nutritionTotals.fat}
              mood={mealMood}
            />
          </View>
        )}
        <SuggestMeals />
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={setSelectedSegment}
            buttons={[
            {
              value: "log",
              icon: "silverware-fork-knife", // ✅ string name
              label: "Log ",
              uncheckedColor: "#888",
              disabled: userPreferences?.hideMealTracking,
            },
            {
              value: "view",
              label: "View logs",
              uncheckedColor: "#888",
              icon: "clipboard-list",
              disabled: userPreferences?.hideMealTracking,
            },
            {
              value: "search",
              label: "Search info",
              icon: "magnify",
              uncheckedColor: "#888",
              disabled: userPreferences?.hideMealTracking,
            },
          ]}
        />
        {selectedSegment  === "log" && !userPreferences?.hideMealTracking && (
          <LogMealCardModal onLog={handleLog}  />
        )}

        {selectedSegment === "view" && !userPreferences?.hideMealTracking && (
          <ViewLoggedMeals />
        )}

        {selectedSegment === "search" && <NutritionSearch />}
      </ScrollView>
    </>
  );

  return (
    <>
      <FlatList
        data={[]} // Placeholder; could be a list of logged meals later
        keyExtractor={(_: any, index: number) => `placeholder-${index}`}
        renderItem={null}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </>
  );
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height; 
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    height: screenHeight,
  },
  greeting: {
    fontSize: 26,
    fontFamily: "PatrickHand-Regular",
    marginBottom: 16,
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  button: {
    width: screenWidth - 40,
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 16,
    paddingVertical: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },
  iconButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  iconButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    fontFamily: "Comfortaa-Regular",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#397af8",
    marginBottom: 20,
    width: "100%",
    paddingVertical: 15,
  },
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  subheaderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
