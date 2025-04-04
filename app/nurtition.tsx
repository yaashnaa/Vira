import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  FlatList,
  Dimensions,
} from "react-native";
import {
  Text,
  Card,
  Button,
  Divider,
  useTheme,
  Appbar,
  SegmentedButtons,
} from "react-native-paper";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
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
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [mealMood, setMealMood] = useState("");

  const router = useRouter();

  const handleLog = ({ nutrition, mood }: any) => {
    setMealsLogged((prev) => prev + 1);
    setNutritionTotals((prev) => ({
      calories: prev.calories + nutrition.calories,
      protein: prev.protein + nutrition.protein,
      carbs: prev.carbs + nutrition.carbs,
      fat: prev.fat + nutrition.fat,
    }));
    setMealMood(mood);
  };

  const handleBackPress = () => {
    router.replace("/dashboard");
  };
  const renderHeader = () => (
    <View style={styles.container}>
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

      <SegmentedButtons
        value={selectedSegment}
        onValueChange={setSelectedSegment}

        buttons={[
          {
            value: "log",
            icon: "silverware-fork-knife", // ✅ string name
            label: "Log ",
            disabled: userPreferences?.hideMealTracking,
            },
            {
            value: "view",
            label: "View logs",
            icon: "clipboard-list",
            disabled: userPreferences?.hideMealTracking,
            },
            {
            value: "search",
            label: "Search info",
            icon: "magnify",
            disabled: userPreferences?.hideMealTracking,
            },
          ]}
           
          />
          {selectedSegment === "log" && !userPreferences?.hideMealTracking && (
          <LogMealCardModal onLog={handleLog} />
          )}

          {selectedSegment === "view" && !userPreferences?.hideMealTracking && (
          <ViewLoggedMeals />
          )}

          {selectedSegment === "search" && (
          <NutritionSearch />
          )}
      {/* <Button
        mode="contained"
        onPress={() => setSearchModal(true)}
        theme={{ colors: { primary: "#f6dfdb" } }}
        textColor="#333"
        style={styles.button}
      >
        <View style={styles.iconButtonContent}>
          <AntDesign name="search1" size={20} color="black" />
          <Text style={styles.iconButtonText}>Search Nutritional Info</Text>
        </View>
      </Button> */}
      {/* <NutritionSearch
        visible={searchModal}
        onDismiss={() => setSearchModal(false)}
      /> */}
      {/* <View style={styles.section}>
        <SuggestMeals />
      </View>

      <View style={styles.section}>
        <ViewLoggedMeals />
      </View> */}
    </View>
  );

  return (
    <>
      <Appbar.Header
        elevated={false}
        dark={false}
        theme={{ colors: { primary: "#f5f5f5" } }}
      >
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title="Nutrition" />
      </Appbar.Header>

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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
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
});
