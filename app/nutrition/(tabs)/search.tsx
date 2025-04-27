import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions, FlatList
} from "react-native";
import { Card, SegmentedButtons } from "react-native-paper";
import { fetchTastyRecipes, TastyRecipe } from "@/utils/api/fetchTastyRecipes";
import WebView from "react-native-webview";
import NutritionSearch from "@/components/Nutrition/searchNutrionalInfo";
import NutritionTipsModal from "@/components/Nutrition/NutritionTips";

const { width, height } = Dimensions.get("window");

export default function RecipeSearchScreen() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<TastyRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [mode, setMode] = useState<"recipes" | "nutrition">("recipes"); // 🟣 NEW

  const handleSearch = async () => {
    if (mode !== "recipes") return;

    try {
      setLoading(true);
      const results = await fetchTastyRecipes(query);
      setRecipes(results);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (recipe: TastyRecipe) => {
    const recipeTags = recipe.tags?.map((t) => t.name.replace(/_/g, " ")) || [];

    return (
      <Card key={recipe.id} mode="outlined" style={styles.card}>
        <ScrollView>
          <View style={styles.tagContainer}>
            {recipeTags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Card.Cover
            source={{ uri: recipe.thumbnail_url }}
            style={styles.cover}
          />
          <Card.Content style={{ paddingBottom: 30 }}>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>
            <Text style={styles.recipeDesc}>
              {recipe.description ? recipe.description : ""}
            </Text>

            {recipe.video_url && recipe.id === playingVideoId && (
              <WebView
                source={{ uri: recipe.video_url }}
                style={styles.video}
              />
            )}
            {recipe.video_url && recipe.id !== playingVideoId && (
              <Text
                style={styles.link}
                onPress={() => setPlayingVideoId(recipe.id)}
              >
                ▶️ Watch Video
              </Text>
            )}
          </Card.Content>
        </ScrollView>
      </Card>
    );
  };

  return (
    <>
      <NutritionTipsModal
        visible={true}
        onDismiss={() => console.log("Modal dismissed")}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.container}>
          <Text style={styles.title}>🔎 Nutrition & Recipe Search</Text>

          {/* 🟣 Segmented Buttons */}
          <SegmentedButtons
            value={mode}
            onValueChange={(value) => setMode(value as "recipes" | "nutrition")}
            buttons={[
              { value: "recipes", label: "Recipes" },
              { value: "nutrition", label: "Nutrition Info" },
            ]}
            style={{ marginBottom: 20 }}
          />

          {mode === "nutrition" ? (
            <>
              <NutritionSearch />
            </>
          ) : (
            <>
              <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search for a recipe..."
                value={query}
                onChangeText={setQuery}
                style={styles.input}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
              </View>

              {loading ? (
              <ActivityIndicator
                size="large"
                color="#A084DC"
                style={{ marginTop: 20 }}
              />
              ) : recipes.length === 0 && query.trim() !== "" ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                🍳 No recipes found. Try another search!
                </Text>
              </View>
              ) : (
              <FlatList<TastyRecipe>
                data={recipes}
                keyExtractor={(item: TastyRecipe) => item.id.toString()}
                renderItem={({ item }: { item: TastyRecipe }) => renderCard(item)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
              />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flex: 1,
    height: height,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    fontFamily: "Main-font",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    fontFamily: "PatrickHand-Regular",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
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
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollView: {
    paddingBottom: 50,
  },
  card: {
    width: 260,
    height: 450,
    marginRight: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cover: {
    height: 180,
    marginTop: 40,
  },
  recipeTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: "PatrickHand-Regular",
  },
  recipeDesc: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    position: "absolute",
    top: 7,
    left: 15,
    zIndex: 1,
  },
  tagBadge: {
    backgroundColor: "#E4DFFD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 9,
    marginBottom: 80,
  },
  tagText: {
    fontSize: 12,
    color: "#5A3E9B",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  link: {
    color: "#5A67D8",
    textDecorationLine: "underline",
    marginTop: 8,
  },
  video: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
});
