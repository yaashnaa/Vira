// components/LogMeal.tsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import { getNutritionData } from "@/utils/nutritionix";

export default function LogMeal({ onLogged }: { onLogged: () => void }) {
  const [mealText, setMealText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!mealText) return;
    setIsLoading(true);
    const data = await getNutritionData(mealText); // API call
    setResult(data);
    setIsLoading(false);
    onLogged();
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="🍽️ Log a Meal" />
      <Card.Content>
        <TextInput
          placeholder="e.g. 1 bowl of oatmeal with banana"
          value={mealText}
          onChangeText={setMealText}
          style={styles.input}
        />
        <Button onPress={handleSubmit} loading={isLoading}>
          Log Meal
        </Button>
        {result && (
          <View style={{ marginTop: 10 }}>
            <Text>Calories: {result.calories} kcal</Text>
            <Text>Protein: {result.protein}g</Text>
            <Text>Carbs: {result.carbs}g</Text>
            <Text>Fat: {result.fat}g</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
