import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import WidgetCardWithAction from "./widgetCardWithAction";
import { IconButton } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@enabledWidgets";

const recommendedWidgets = [
  {
    id: "1",
    title: "Nutrition",
    image: require("../assets/images/widgets/diet.png"),
    link: "../app/nutrition.tsx",
  },
  {
    id: "2",
    title: "Mindfullness",
    image: require("../assets/images/widgets/yoga.png"),
  },
  {
    id: "3",
    title: "Water Intake",
    image: require("../assets/images/widgets/water.png"),
  },
  {
    id: "4",
    title: "Fitness",
    image: require("../assets/images/widgets/triangle.png"),
  },
  {
    id: "5",
    title: "Journal",
    image: require("../assets/images/widgets/notebook.png"),
  },
  {
    id: "6",
    title: "Mood Tracker",
    image: require("../assets/images/widgets/mood.png"),
  },
];

const { width } = Dimensions.get("window");
interface RecommendedWidgetsBannerProps {
  triggerRefresh?: number;
  onAddWidget?: (id: string) => void;
}

export default function RecommendedWidgetsBanner({
  triggerRefresh,
  onAddWidget,
}: RecommendedWidgetsBannerProps) {
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
  }, [triggerRefresh]);

  const handleAddWidget = async (widgetTitle: string) => {
    const widgetId = widgetTitle.toLowerCase(); // normalize
    if (enabledWidgets.includes(widgetId)) return;

    const updatedWidgets = [...enabledWidgets, widgetId];
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
          widget.title.toLowerCase() === title.toLowerCase() &&
          !enabledWidgets.includes(widget.title.toLowerCase())
      )
    )
    .filter(Boolean);
  console.log("📦 Recommended left:", prioritizedWidgets.length);
  console.log("📦 Recommended widgets:", prioritizedWidgets);

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
              <WidgetCardWithAction
                key={widget.id}
                title={widget.title}
                imageSource={widget.image}
                onPress={() => onAddWidget?.(widget.title)}
                onAction={() => onAddWidget?.(widget.title)}
                actionIcon="plus-circle"
                actionColor="#856ab0"
              />
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
  card: {
    backgroundColor: "#f8f6f4",
    borderRadius: 16,
    padding: 1,
    width: 145,
    height: 155,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    margin: 10,
  },
  image: {
    width: 64,
    height: 67,
    resizeMode: "contain",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Main-font",
    color: "#100f0d",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#1c110d",
    fontFamily: "Comfortaa-Regular",
    marginTop: 4,
    textAlign: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
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
