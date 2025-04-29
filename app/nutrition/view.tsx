import ViewLoggedMeals from "@/components/Nutrition/viewLoggedMeals";
import { useUserPreferences } from "@/context/userPreferences";
import { View } from "react-native";

export default function ViewMealsTab() {
  const { userPreferences } = useUserPreferences();

  if (userPreferences?.hideMealTracking) return null;

  return (
    <View style={{ padding: 20 }}>
      <ViewLoggedMeals />
    </View>
  );
}
