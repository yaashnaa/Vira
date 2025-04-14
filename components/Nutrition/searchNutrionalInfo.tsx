import { Searchbar, Portal, Modal } from "react-native-paper";
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { getNutritionData } from "@/utils/nutritionix";
import { useUserPreferences } from "@/context/userPreferences";

export function getFriendlyNutrientHighlights(fullNutrients: any[]) {
  const highlights = [];

  const lookup = (id: number) =>
    fullNutrients.find((n) => n.attr_id === id)?.value || 0;

  if (lookup(203) > 10) highlights.push("high in protein");
  if (lookup(291) > 5) highlights.push("a good source of fiber");
  if (lookup(306) > 300) highlights.push("rich in potassium");
  if (lookup(301) > 100) highlights.push("a good source of calcium");
  if (lookup(303) > 2) highlights.push("contains iron");
  if (lookup(324) > 5) highlights.push("A good source of vitamin D");

  return highlights;
}
interface NutritionSearchProps {
  visible: boolean;
  onDismiss: () => void;
}

function NutritionSearchModal() {
  const { userPreferences } = useUserPreferences();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  type FoodItem = {
    food_name: string;
    nf_calories: number;
    nf_protein: number;
    nf_total_carbohydrate: number;
    nf_total_fat: number;
    full_nutrients: { attr_id: number; value: number }[];
  };

  const [results, setResults] = useState<FoodItem[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await getNutritionData(query);
      setResults(data.foods); // Set results from API
    } catch (error) {
      console.error("Nutrition fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const { height } = Dimensions.get("window");

  return (
    <View style={{ height: "80%" }}>
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.food_name}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.foodName}>
              {item.food_name.replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>

            {!userPreferences.macroViewing &&
            !userPreferences.calorieViewing ? (
              <View style={styles.friendlySummary}>
                {getFriendlyNutrientHighlights(item.full_nutrients).map(
                  (text, index) => (
                    <Text key={index}>🌟 This food is {text}.</Text>
                  )
                )}
              </View>
            ) : (
              <>
                {userPreferences?.calorieViewing && (
                  <Text>
                    Calories: {item.nf_calories ?? "Not available"} kcal
                  </Text>
                )}
                {userPreferences?.macroViewing && (
                  <View>
                    <Text style={styles.nutrientText}>
                      🍗 Protein: {item.nf_protein ?? "N/A"} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      🍞 Carbs: {item.nf_total_carbohydrate ?? "N/A"} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      🧈 Fat: {item.nf_total_fat ?? "N/A"} g
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search for food"
              placeholderTextColor="#504f4f"
              value={query}
              iconColor="#504f4f"
              onChangeText={setQuery}
              onIconPress={handleSearch}
              onSubmitEditing={handleSearch}
              inputStyle={{ color: "#000000" }}
              style={[styles.searchbar, { backgroundColor: "#fae8e5" }]}
            />
            {loading && <Text style={styles.loadingText}>Loading...</Text>}
          </View>
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 8,
    marginTop: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
    color: "#888",
  },
  resultItem: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  foodName: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "PatrickHand-regular",
  },
  friendlySummary: {
    marginTop: 8,
  },
  nutrientText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Comfortaa-Regular",
    marginVertical: 2,
  }
,  
  list: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default NutritionSearchModal;
