
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getNutritionData } from "@/utils/nutritionix";
import { useUserPreferences } from "@/context/userPreferences";
import { Card } from "react-native-paper";

export function getFriendlyNutrientHighlights(fullNutrients: any[]) {
  const highlights = [];
  const fallbackMessages = [
    "nutritious in its own way",
    "a wholesome choice",
    "great for a balanced diet",
    "a nice addition to your meal",
  ];
  
  const lookup = (id: number) =>
    fullNutrients.find((n) => n.attr_id === id)?.value || 0;

  if (lookup(203) > 10) highlights.push("high in protein");
  if (lookup(291) > 5) highlights.push("a good source of fiber");
  if (lookup(306) > 300) highlights.push("rich in potassium");
  if (lookup(301) > 100) highlights.push("a good source of calcium");
  if (lookup(303) > 2) highlights.push("contains iron");
  if (lookup(324) > 5) highlights.push("a good source of vitamin D");


  if (highlights.length === 0) {
    const randomIndex = Math.floor(Math.random() * fallbackMessages.length);
    highlights.push(fallbackMessages[randomIndex]);
  }

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
      setResults(data.foods);
    } catch (error) {
      console.error("Nutrition fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for a food..."
            value={query}
            placeholderTextColor={"#888"}
            onChangeText={setQuery}
            style={styles.input}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
          {loading && <Text style={styles.loadingText}>Loading...</Text>}
        </View>
      }
      data={results}
      keyExtractor={(item, index) => `${item.food_name}-${index}`}
      renderItem={({ item }) => (
        <Card mode="outlined" style={styles.card}>
          <Card.Content>
            <Text style={styles.foodName}>
              {item.food_name.replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>

            {!userPreferences.macroViewing &&
            !userPreferences.calorieViewing ? (
              <View style={styles.friendlySummary}>
                {getFriendlyNutrientHighlights(item.full_nutrients).map(
                  (text, index) => (
                    <Text key={index} style={styles.highlightText}>
                      🌟 This food is {text}.
                    </Text>
                  )
                )}
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                {userPreferences?.calorieViewing && (
                  <Text style={styles.nutrientText}>
                    🔥 Calories: {item.nf_calories ?? "N/A"} kcal
                  </Text>
                )}
                {userPreferences?.macroViewing && (
                  <>
                    <Text style={styles.nutrientText}>
                      🍗 Protein: {item.nf_protein ?? "N/A"} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      🍞 Carbs: {item.nf_total_carbohydrate ?? "N/A"} g
                    </Text>
                    <Text style={styles.nutrientText}>
                      🧈 Fat: {item.nf_total_fat ?? "N/A"} g
                    </Text>
                  </>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      )}
      contentContainerStyle={styles.list}
      style={styles.container}
    />
  );
}


export default NutritionSearchModal;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    // paddingTop: 40,
    // paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Kalam-Regular",
    marginBottom: 6,
  },
  searchbar: {
    backgroundColor: "#fae8e5",
    marginBottom: 12,
    // marginTop: 20,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
    color: "#888",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    width: width * 0.9,
    alignSelf: "center",
    elevation: 2,
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  foodName: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
    marginBottom: 6,
    color: "#333",
  },
  nutrientText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  highlightText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
    fontFamily: "Comfortaa-Regular",
  },
  list: {
    paddingBottom: 50,
    paddingTop: 10,
  },
  friendlySummary: {
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#A084DC",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
    fontFamily: "Main-font",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    
  },
});
