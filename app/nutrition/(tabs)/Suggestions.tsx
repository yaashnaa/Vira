import NutritionSearch from "@/components/Nutrition/searchNutrionalInfo";
import SuggestMeals from "@/components/Nutrition/suggestMeals";
import { View } from "react-native";

export default function Recipes() {
  return (
    <View style={{ padding: 20, backgroundColor: "#fff" }}>

      <SuggestMeals />
    </View>
  );
}
