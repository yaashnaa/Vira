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
import { auth } from "@/config/firebaseConfig";
import Toast from "react-native-toast-message";

const recommendedWidgets = [
  {
    id: "nutrition",
    title: "Nutrition",
    image: require("../assets/images/widgetImages/diet.png"),
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
interface RecommendedwidgetImagesBannerProps {
  triggerRefresh?: number;
  onAddWidget?: (id: string) => void; // ✅ Add this line
}

const { width } = Dimensions.get("window");

export default function RecommendedWidgetsBanner({
  triggerRefresh,
  onAddWidget,
}: RecommendedwidgetImagesBannerProps) {
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

  const handleAddWidget = async (id: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid || enabledWidgets.includes(id)) return;

    await addWidget(uid, id);
    setEnabledWidgets((prev) => [...prev, id]);
    onAddWidget?.(id); 
  };

  const widgetsToRecommend = recommendedWidgets.filter(
    (w) => !enabledWidgets.includes(w.id)
  );

  if (widgetsToRecommend.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended Widgets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {widgetsToRecommend.map((widget) => (
          <WidgetCardWithAction
            key={widget.id}
            title={widget.title}
            imageSource={widget.image}
            onPress={() => handleAddWidget(widget.id)}
            onAction={() => handleAddWidget(widget.id)}
            actionIcon="plus-circle"
            actionColor="#856ab0"
          />
        ))}
      </ScrollView>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
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
});
