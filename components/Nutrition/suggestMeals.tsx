import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Card } from "react-native-paper";
import { fetchTastyRecipes } from "@/utils/api/fetchTastyRecipes";
import { useUserPreferences } from "@/context/userPreferences";
import Webview from "react-native-webview";
import FilterMenu from "./filterMenu";
import { useMoodContext } from "@/context/moodContext";
import { auth, db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";

export interface TastyRecipe {
  id: number;
  name: string;
  description?: string;
  thumbnail_url: string;
  video_url?: string;
  names?: string[];
  tags?: { name: string }[];
}

export default function SuggestMeals() {
  const { userPreferences } = useUserPreferences();
  const { hasLoggedToday } = useMoodContext();
  const [recipes, setRecipes] = useState<TastyRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // NEW
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const mood = userPreferences?.foodAnxietyLevel || "";
  const preferences = userPreferences?.dietaryPreferences || [];
  const goals = userPreferences?.primaryGoals || [];
  const mentalHealth = userPreferences?.mentalHealthConditions || [];
  const moodCheckInOptedOut = !userPreferences?.moodcCheckInBool;
  const useMoodTags = hasLoggedToday && !moodCheckInOptedOut;

  const getRecipes = async () => {
    setLoading(true);
    try {
      const preferenceToTagMap: Record<string, string> = {
        Vegetarian: "vegetarian",
        Vegan: "vegan",
        "Gluten-free": "gluten_free",
        "Dairy-free": "dairy_free",
      };
      
      const goalToTagMap: Record<string, string> = {
        "General fitness/health": "healthy",
        "Weight management or body recomposition": "low_calorie",
        "Improve mental well-being": "comfort_food",
        "Build consistent eating habits": "easy",
        "Enhance social connections or community support": "brunch",
        "Learn about nutrition and healthy eating": "vegetarian",
        "Track progress and set goals": "meal_prep",
        "Improve mindfulness or self-care habits": "under_30_minutes",
      };
      
      const userTags = preferences.map((p) => preferenceToTagMap[p]).filter(Boolean);
      const goalTags = goals.map((g) => goalToTagMap[g]).filter(Boolean);
  
      const tags = [...userTags, ...goalTags];

      const hasLowMood =
        mood.includes("Not Happy") ||
        mood.includes("Very Unhappy") ||
        mood.toLowerCase().includes("anxious");

      if (hasLowMood) {
        tags.push("comfort_food", "easy");
      }
      const randomOffset = Math.floor(Math.random() * 100);
      const results = await fetchTastyRecipes("", tags, randomOffset);
      const shuffledResults = results.sort(() => Math.random() - 0.5);

      setRecipes(shuffledResults);
    } catch (err) {
      console.error("Recipe fetch failed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false); // ← Reset refreshing
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getRecipes();
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const tagNames = r.tags?.map((tag) => tag.name.toLowerCase()) || [];
    switch (filter.toLowerCase()) {
      case "easy":
        return tagNames.includes("under_30_minutes");
      case "high protein":
        return tagNames.includes("high_protein");
      case "under 30 minutes":
        return tagNames.includes("under_30_minutes");
        case "dinner":
          return tagNames.includes("dinner");
      case "all":
      default:
        return true;
    }
  });

  if (loading && !refreshing)
    return <Text style={styles.loading}>Loading meal suggestions...</Text>;

  const renderCard = (recipe: TastyRecipe) => {
    const recipeTags = recipe.tags?.map((t) => t.name.replace(/_/g, " ")) || [];

    return (
      <Card key={recipe.id} mode="outlined" style={[styles.card]}>
        <View style={styles.tagContainer}>
          {recipeTags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Card.Cover source={{ uri: recipe.thumbnail_url }} style={styles.cover} />
        <ScrollView>
          <Card.Content>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>
            <Text style={styles.recipeDesc}>
              {recipe.description ? recipe.description : ""}
            </Text>

            {recipe.video_url && recipe.id === playingVideoId && (
              <Webview source={{ uri: recipe.video_url }} style={styles.video} />
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
    <View style={styles.container}>
     <Text style={styles.title}>
        {useMoodTags
          ? "🍽️ Suggested Meals for Your Mood"
          : "🍽️ Suggested Meals"}
      </Text>
      <FilterMenu onSelect={(value: string) => setFilter(value)} />
      {!hasLoggedToday && !moodCheckInOptedOut && (
        <Text style={styles.subtitle}>
          Log your mood for more personalized suggestions!
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollView}
      >
        {filteredRecipes.map((recipe) => renderCard(recipe))}
      </ScrollView>
    </View>
  );
}

const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "#fff",
    height: height,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
    paddingLeft: 10,
    textAlign: "center",
    fontFamily: "Kalam-Regular",
  },
  loading: {
    padding: 20,
    textAlign: "center",
    fontSize: 16,
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
  scrollView: {
    paddingLeft: 10,
    backgroundColor: "white",
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
  link: {
    color: "#5A67D8",
    textDecorationLine: "underline",
    marginTop: 8,
    marginBottom: 8,
  },
  video: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily: "Main-font",
  },
});
