import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
} from "react-native";
import {
  Text,
  Card,
  Button,
  Divider,
  useTheme,
  Snackbar,
  Appbar,
} from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import { useRouter } from "expo-router";

export default function NutritionScreen() {
  const { userPreferences } = useUserPreferences();
  const [meal, setMeal] = useState("");
  const [snackVisible, setSnackVisible] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const handleLogMeal = () => {
    if (meal.trim()) {
      // You could also save it to Firebase or AsyncStorage here
      console.log("Meal logged:", meal);
      setSnackVisible(true);
      setMeal("");
    }
  };

  const getSuggestedMeals = () => {
    const diet = userPreferences?.dietaryPreferences || [];
    const suggestions = [
      { title: "Veggie Wrap", tags: ["Vegetarian", "Vegan"] },
      { title: "Quinoa Bowl", tags: ["Gluten-free"] },
      { title: "Chickpea Salad", tags: ["Dairy-free", "Vegan"] },
    ];
    return suggestions.filter((item) =>
      diet.length ? item.tags.some((tag) => diet.includes(tag)) : true
    );
  };
  const handleBackPress = () => {
    router.replace("/dashboard");
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title="Nutrition" />
      
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>
          Hello, {userPreferences?.name || "friend"} 🥗
        </Text>

        <Text style={styles.sectionTitle}>Log Your Meal</Text>
        {userPreferences?.hideMealTracking ? (
          <Text style={styles.disabledText}>
            You’ve opted out of meal logging. You can change this in Settings.
          </Text>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <RNTextInput
                placeholder="What did you eat?"
                value={meal}
                onChangeText={setMeal}
                style={styles.input}
                multiline
              />
              <Button
                mode="contained"
                onPress={handleLogMeal}
                style={styles.button}
                textColor="#390a84"
                buttonColor="#C3B1E1"
              >
                Log Meal
              </Button>
            </Card.Content>
          </Card>
        )}

        {userPreferences?.calorieViewing && (
          <>
            <Text style={styles.sectionTitle}>Today’s Nutrition Summary</Text>
            <Card style={styles.card}>
              <Card.Content>
                <Text>Calories: 1450 kcal</Text>
                {userPreferences?.macroViewing && (
                  <>
                    <Text>Protein: 80g</Text>
                    <Text>Carbs: 160g</Text>
                    <Text>Fat: 50g</Text>
                  </>
                )}
              </Card.Content>
            </Card>
          </>
        )}

        <Text style={styles.sectionTitle}>Suggested Meals</Text>
        {getSuggestedMeals().map((meal) => (
          <Card key={meal.title} style={styles.card}>
            <Card.Title title={meal.title} />
            <Card.Content>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Tags: {meal.tags.join(", ")}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {userPreferences?.foodAnxiety?.includes("anxious") && (
          <>
            <Divider style={{ marginVertical: 20 }} />
            <Text style={styles.sectionTitle}>Gentle Support</Text>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={{ marginBottom: 10 }}>
                  Feeling overwhelmed with food? Try a quick breathing exercise.
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => router.push("/dashboard")}
                >
                  Calm Breathing Tool
                </Button>
              </Card.Content>
            </Card>
          </>
        )}

        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={2000}
        >
          Meal logged successfully!
        </Snackbar>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  greeting: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginBottom: 10,
  },
  button: {
    borderRadius: 8,
  },
  disabledText: {
    fontStyle: "italic",
    color: "gray",
    marginBottom: 20,
  },
});
