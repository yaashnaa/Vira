import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useRouter } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import Header from "@/components/header";
import MoodCalendar from "@/components/moodCalender"; // update the path as needed
import TrendChart from "@/components/trendChart"; // update the path as needed
export default function Mood() {
  const [selectedSegment, setSelectedSegment] = useState<
    "mood" | "sleep" | "energy"
  >("mood");
  const router = useRouter();

 

  return (
    <>
      <Header title="Insights" />
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <MoodCalendar />
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={(value) =>
            setSelectedSegment(value as "mood" | "sleep" | "energy")
          }
          buttons={[
            { value: "mood", label: "Mood" },
            { value: "sleep", label: "Sleep" },
            { value: "energy", label: "Energy" },
          ]}
          style={{
            backgroundColor: "#f4f0ff",
            borderRadius: 10,
            marginTop: 20,
          }}
          theme={{
            colors: {
              secondaryContainer: "#564592", // Active background
              onSecondaryContainer: "#ffffff", // Active text color
              surfaceVariant: "#ddd", // Inactive background
              onSurfaceVariant: "#000000", // Inactive text
            },
          }}
        />

        <View style={{ marginTop: 20 }}>
          <TrendChart metric={selectedSegment} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRight: {
    flexDirection: "row",
    marginTop: 5,
  },
});
