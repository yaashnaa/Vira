import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WaterWidget from '@/components/widgets/WaterWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import FitnessWidget from '@/components/widgets/FitnessWidget';
import NutritionWidget from '@/components/widgets/NutritionWidget';
import JournalWidget from '@/components/widgets/JournalWidget';
import MindfullnessWidget from '@/components/widgets/Mindfullness';
import ThoughtReframeWidget from '@/components/widgets/ThoughtReframeWidget';
import CopingBoxWidget from '@/components/widgets/CopingBoxWidget';
import CBTToolsWidget from '@/components/widgets/CBTToolsWidget';
import RecommendedWidgetsBanner from '@/components/recommendedWidegts';
import {  Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function PinnedWidgetsSection({
  enabledWidgets,
  uid,
  onRemove,
  onAdd,
  triggerRefresh
}: {
  enabledWidgets: string[];
  uid: string;
  onRemove: (uid: string, widgetId: string) => void;
  onAdd: (widgetId: string) => void;
  triggerRefresh: number;
}) {
  const hasNoPinned = enabledWidgets.length === 0;

  return (
    <View style={{ marginBottom: 50 }}>
      {hasNoPinned ? (
        <RecommendedWidgetsBanner
          triggerRefresh={triggerRefresh}
          onAddWidget={onAdd}
        />
      ) : (
        <>
          <Text style={[styles.sectionHeader, { marginLeft: 20 }]}>Your Pinned Widgets</Text>
          <View style={styles.gridContainer}>
            {enabledWidgets.includes("water") && (
              <WaterWidget onRemove={() => onRemove(uid, "water")} />
            )}
            {enabledWidgets.includes("mood") && (
              <MoodWidget onRemove={() => onRemove(uid, "mood")} />
            )}
            {enabledWidgets.includes("fitness") && (
              <FitnessWidget onRemove={() => onRemove(uid, "fitness")} />
            )}
            {enabledWidgets.includes("nutrition") && (
              <NutritionWidget onRemove={() => onRemove(uid, "nutrition")} />
            )}
            {enabledWidgets.includes("journal") && (
              <JournalWidget onRemove={() => onRemove(uid, "journal")} />
            )}
            {enabledWidgets.includes("mindfulness") && (
              <MindfullnessWidget onRemove={() => onRemove(uid, "mindfulness")} />
            )}
            {enabledWidgets.includes("thoughtReframe") && (
              <ThoughtReframeWidget onRemove={() => onRemove(uid, "thoughtReframe")} />
            )}
            {enabledWidgets.includes("copingBox") && (
              <CopingBoxWidget onRemove={() => onRemove(uid, "copingBox")} />
            )}
            {enabledWidgets.includes("cbtTools") && (
              <CBTToolsWidget onRemove={() => onRemove(uid, "cbtTools")} />
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 8,
    marginTop: 20,
    paddingLeft: 6,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 12,
  },
});
