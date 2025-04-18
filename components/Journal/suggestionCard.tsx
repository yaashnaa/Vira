import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button } from "react-native-paper";

interface Props {
  mood: number | null;
  energyLevel: string;
}

export default function SuggestionCard({ mood, energyLevel }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getSuggestions = () => {
    if (mood === null) return [];

    const suggestionSets = [
      {
        condition: mood >= 75 && energyLevel === "Fully Charged",
        suggestions: [
          { emoji: "🏋️‍♀️", text: "Try a new workout routine" },
          { emoji: "🥗", text: "Cook a high-protein energizing meal" },
          { emoji: "🧹", text: "Tackle a productive task you’ve been postponing" },
        ],
      },
      {
        condition: mood >= 50 && energyLevel === "Energized",
        suggestions: [
          { emoji: "💃", text: "Dance to your favorite playlist" },
          { emoji: "🧁", text: "Try baking or experimenting in the kitchen" },
          { emoji: "🚶‍♂️", text: "Go for a brisk walk" },
        ],
      },
      {
        condition: mood >= 25 || energyLevel === "Low Energy",
        suggestions: [
          { emoji: "📓", text: "Journal your thoughts" },
          { emoji: "🧘", text: "Do a short guided meditation" },
          { emoji: "🌿", text: "Step outside for fresh air" },
        ],
      },
      {
        condition: true,
        suggestions: [
          { emoji: "😌", text: "Focus on deep breathing" },
          { emoji: "🛌", text: "Take a short nap or rest" },
          { emoji: "💧", text: "Stay hydrated and kind to yourself" },
        ],
      },
    ];

    const matchedSet = suggestionSets.find((set) => set.condition);
    return matchedSet ? matchedSet.suggestions : [];
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // triggers new suggestions (you can shuffle if needed)
  };

  const suggestions = getSuggestions();

  if (suggestions.length === 0) return null;

  return (
    <Card style={styles.card} key={refreshKey}>
      <Card.Title
        title="✨ Personalized Suggestions"
        titleStyle={styles.title}
        right={() => (
          <TouchableOpacity onPress={() => setCollapsed((prev) => !prev)}>
            <Text style={styles.collapseText}>{collapsed ? "Expand" : "Collapse"}</Text>
          </TouchableOpacity>
        )}
      />
      {!collapsed && (
        <Card.Content>
          {suggestions.map((item, index) => (
            <View key={index} style={styles.suggestionItem}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          ))}
          <Button onPress={handleRefresh} textColor="#200e41" style={styles.button} icon="refresh">
            Show Other Ideas
          </Button>
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F0FF",
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 20,
    padding: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: "PatrickHand-Regular",
    color: "#4b0082",
  },
  collapseText: {
    fontSize: 14,
    color: "#7e5a9b",
    marginRight: 12,
    fontFamily: "Main-font",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontFamily: "Main-font",
    color: "#333",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#DDCEFF",
  },
});
