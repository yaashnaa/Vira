import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { Card } from "react-native-paper";
import { fetchTastyRecipes } from "@/utils/api/fetchTastyRecipes";
import { useUserPreferences } from "@/context/userPreferences";
import ViewLoggedMeals, { getTodayMealsLogged } from "./viewLoggedMeals";
import Webview from "react-native-webview";
import FilterMenu from "./filterMenu";
import { useMoodContext } from "@/context/moodContext";
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
  const devMode = true;
  const [mealsLogged, setMealsLogged] = useState<string[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const moodCheckInOptedOut = !userPreferences?.moodcCheckInBool;
  const useMoodTags = hasLoggedToday && !moodCheckInOptedOut;

  const mood = userPreferences?.foodAnxietyLevel || "";
  const preferences = userPreferences?.dietaryPreferences || [];
  const goals = userPreferences?.primaryGoals || [];
  const mentalHealth = userPreferences?.mentalHealthConditions || [];

  const preferenceToTagMap: Record<string, string> = {
    Vegetarian: "vegetarian",
    Vegan: "vegan",
    "Gluten-free": "gluten_free",
    "Dairy-free": "dairy_free",
  };

  const goalToTagMap: Record<string, string> = {
    "General fitness/health": "healthy",
    "Weight management or body recomposition": "low_calorie", // or "balanced"
    "Improve mental well-being": "comfort_food",
    "Build consistent eating habits": "easy",
    "Enhance social connections or community support": "brunch", // or "shareable"
    "Learn about nutrition and healthy eating": "vegetarian", // safe default
    "Track progress and set goals": "meal_prep",
    "Improve mindfulness or self-care habits": "under_30_minutes",
  };

  const userTags = preferences
    .map((p) => preferenceToTagMap[p])
    .filter(Boolean);
  const goalTags = goals.map((g) => goalToTagMap[g]).filter(Boolean);

  useEffect(() => {
    const getRecipes = async () => {
      if (devMode) {
        // 👇 use static mock data
        setRecipes([
          {
            id: 1,
            name: "Mock Pasta Delight",
            thumbnail_url: "https://via.placeholder.com/300x200.png?text=Pasta",
            description:
              "This is a test recipe for mock purposes. Try the <a href='https://tasty.co/recipe/mock-recipe'>Mock Link</a>!",
            video_url:
              "https://vid.tasty.co/output/269291/hls24_1673508832.m3u8",
            tags: [{ name: "easy" }, { name: "vegetarian" }],
          },
          {
            id: 2,
            name: "Healthy Quinoa Bowl",
            thumbnail_url:
              "https://via.placeholder.com/300x200.png?text=Quinoa",
            description: "Packed with protein and flavor.",
            tags: [{ name: "high_protein" }, { name: "gluten_free" }],
          },
        ]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const tags = [...userTags, ...goalTags];

        const hasLowMood =
          mood.includes("Not Happy") ||
          mood.includes("Very Unhappy") ||
          mood.toLowerCase().includes("anxious");

        const hasMentalHealthFlags = ["Depression", "Anxiety"].some((cond) =>
          mentalHealth.includes(cond)
        );

        if (useMoodTags && hasLowMood) {
          tags.push("easy", "comfort_food", "no_bake_desserts", "top_friendly");
        }

        if (useMoodTags && hasMentalHealthFlags) {
          tags.push("under_45_minutes", "under_30_minutes");
        }

        const todayMeals = await getTodayMealsLogged();
        setMealsLogged(todayMeals);

        const mealTypes = ["breakfast", "lunch", "dinner"];
        const unloggedMeals = mealTypes.filter((m) => !todayMeals.includes(m));
        if (unloggedMeals.length > 0) {
          tags.push(unloggedMeals[0]);
        }

        if (tags.length === 0) tags.push("healthy");

        const results = await fetchTastyRecipes("", tags);
        console.log("Tags for first recipe:", results[0]?.name);

        setRecipes(results);
      } catch (err) {
        console.error("Recipe fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

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
      case "all":
      default:
        return true;
    }
  });

  if (loading)
    return <Text style={styles.loading}>Loading meal suggestions...</Text>;

  const renderCard = (recipe: TastyRecipe) => {
    const recipeTags = recipe.tags?.map((t) => t.name.replace(/_/g, " ")) || [];

    return (
      <Card
        key={recipe.id}
        mode="outlined"
        style={[styles.card]}
     
      >
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
        contentContainerStyle={styles.scrollView}
      >
        {filteredRecipes.map((recipe) => renderCard(recipe))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    paddingLeft: 10,
    fontFamily: "Kalam-Regular",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily: "Comfortaa-Regular",
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
    height: 400,
    marginRight: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#white",
  },
  cover: {
    height: 180,
    marginTop: 40,
    borderRadius: 0,
    margin: 0,
    padding: 0,
    width: "100%",
    // backgroundColor: "green",
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
  },
  loading: {
    padding: 20,
    textAlign: "center",
    fontSize: 16,
  },
  video: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
