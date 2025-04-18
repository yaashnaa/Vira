import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

import { getEnabledWidgets, addWidget } from "@/utils/widgetStorage";
import WidgetCardWithAction from "./widgetCardWithAction";
import { IconButton } from "react-native-paper";
import { useUserPreferences } from "@/context/userPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config/firebaseConfig";
const STORAGE_KEY = "@enabledWidgets";

const recommendedWidgets = [
  {
    id: "nutrition",
    title: "Nutrition",
    image: require("../assets/images/widgetImages/diet.png"),
    link: "../app/nutrition.tsx",
  },
  {
    id: "mindfulness",
    title: "Mindfullness",
    image: require("../assets/images/widgetImages/yoga.png"),
  },
  {
    id: "water",
    title: "Water Intake",
    image: require("../assets/images/widgetImages/water.png"),
  },
  {
    id: "fitness",
    title: "Fitness",
    image: require("../assets/images/widgetImages/triangle.png"),
  },
  {
    id: "journal",
    title: "Journal",
    image: require("../assets/images/widgetImages/notebook.png"),
  },
  {
    id: "mood",
    title: "Mood Tracker",
    image: require("../assets/images/widgetImages/mood.png"),
  },
];

const { width } = Dimensions.get("window");
interface RecommendedwidgetImagesBannerProps {
  triggerRefresh?: number;
  onAddWidget?: (id: string) => void;
}

export default function RecommendedWidgetsBanner({
  triggerRefresh,
  onAddWidget,
}: RecommendedwidgetImagesBannerProps) {
  const { userPreferences } = useUserPreferences();
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);

  useEffect(() => {
    const loadWidgets = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const stored = await getEnabledWidgets(uid);
      setEnabledWidgets(stored);
    };
    loadWidgets();
  }, [triggerRefresh]);

  useEffect(() => {
    const loadWidgets = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const stored = await getEnabledWidgets(uid);
      setEnabledWidgets(stored);
    };
    loadWidgets();
  }, [triggerRefresh]);

  const goals = userPreferences?.primaryGoals || [];
  const widgetPriorityMap: Record<string, string> = {
    "Learn about nutrition and healthy eating": "nutrition",
    "Improve mindfulness or self-care habits": "mindfullness",
    "General fitness/health": "fitness",
    "Track progress and set goals": "journal",
    "Weight management or body recomposition": "nutrition",
    "Enhance social connections or community support": "journal",
    "Build consistent eating habits": "nutrition",
    "Improve mental well-being": "mindfullness",
  };

  const goalBasedWidgetTitles = goals
    .map((goal) => widgetPriorityMap[goal])
    .filter(Boolean);

    const sortedWidgets = [
      ...goalBasedWidgetTitles,
      ...recommendedWidgets.map((w) => w.id),
    ];
    

  const deduplicatedSortedWidgets = Array.from(new Set(sortedWidgets));

  const prioritizedWidgets = deduplicatedSortedWidgets
    .map((id) =>
      recommendedWidgets.find(
        (widget) => widget.id === id && !enabledWidgets.includes(widget.id)
      )
    )
    .filter((widget): widget is typeof recommendedWidgets[0] => widget !== undefined);

  console.log("📦 Recommended left:", prioritizedWidgets.length);
  console.log("📦 Recommended widgets:", prioritizedWidgets);
  console.log("🧩 Enabled widgets:", enabledWidgets);
  console.log("🧠 Sorted candidates:", sortedWidgets);
  
  if (prioritizedWidgets.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended Widgets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {prioritizedWidgets.map((widget) => (
          <WidgetCardWithAction
            key={widget.id}
            title={widget.title}
            imageSource={widget.image}
            onPress={() => onAddWidget?.(widget.id)}
            onAction={() => onAddWidget?.(widget.id)}
            actionIcon="plus-circle"
            actionColor="#856ab0"
          />
        ))}
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
