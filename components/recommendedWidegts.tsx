import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { IconButton } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@enabledWidgets";

const recommendedWidgets = [
  {
    id: "1",
    title: "Nutrition",
    image: require("../assets/images/widgetImages/vegetable.jpg"),
    link: "../app/nutrition.tsx",
  },
  {
    id: "2",
    title: "Mindfullness",
    image: require("../assets/images/widgetImages/meditation.png"),
  },
  {
    id: "3",
    title: "Water Intake",
    image: require("../assets/images/widgetImages/water.jpg"),
  },
  {
    id: "4",
    title: "Fitness",
    image: require("../assets/images/widgetImages/stretch.jpg"),
  },
  {
    id: "5",
    title: "Journal",
    image: require("../assets/images/widgetImages/journal.png"),
  },
  {
    id: "6",
    title: "Mood Tracker",
    image: require("../assets/images/widgetImages/mood.jpg"),
  },
];

const { width } = Dimensions.get("window");

export default function RecommendedWidgetsBanner() {
  const { userPreferences } = useUserPreferences();
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);

  useEffect(() => {
    const fetchWidgets = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEnabledWidgets(JSON.parse(stored));
      }
    };
    fetchWidgets();
  }, []);

  const handleAddWidget = async (widgetId: string) => {
    const updatedWidgets = [...enabledWidgets, widgetId.toLowerCase()];
    setEnabledWidgets(updatedWidgets);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWidgets));
  };

  const goals = userPreferences?.primaryGoals || [];
  const widgetPriorityMap: Record<string, string> = {
    "Learn about nutrition and healthy eating": "Nutrition",
    "Improve mindfulness or self-care habits": "Mindfullness",
    "General fitness/health": "Exercise",
    "Track progress and set goals": "Journal",
    "Weight management or body recomposition": "Nutrition",
    "Enhance social connections or community support": "Journal",
    "Build consistent eating habits": "Nutrition",
    "Improve mental well-being": "Mindfullness",
  };

  const goalBasedWidgetTitles = goals
    .map((goal) => widgetPriorityMap[goal])
    .filter(Boolean);

  const sortedWidgets = [
    ...goalBasedWidgetTitles,
    ...recommendedWidgets.map((w) => w.title),
  ];

  const deduplicatedSortedWidgets = Array.from(new Set(sortedWidgets));

  const prioritizedWidgets = deduplicatedSortedWidgets
    .map((title) =>
      recommendedWidgets.find(
        (widget) =>
          widget.title === title &&
          !enabledWidgets.includes(widget.title.toLowerCase())
      )
    )
    .filter(Boolean);

  if (prioritizedWidgets.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended Widgets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {prioritizedWidgets.map(
          (widget) =>
            widget && (
              <View key={widget.id} style={styles.widgetCard}>
                <Image source={widget.image} style={styles.widgetImage} />
                <View style={styles.cardFooter}>
                  <Text style={styles.widgetTitle}>{widget.title}</Text>
                  <IconButton
                    icon="plus"
                    mode="outlined"
                    theme={{ colors: { primary: "#C3B1E1" } }}
                    containerColor="rgba(195,177,225, 0.3)"
                    size={30}
                    onPress={() => handleAddWidget(widget.title)}
                  />
                </View>
              </View>
            )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 16,
  },
  scrollRow: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 12,
  },
  widgetCard: {
    width: width * 0.6,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  widgetImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
