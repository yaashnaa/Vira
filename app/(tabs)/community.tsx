// app/(tabs)/community/index.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, StyleSheet, Text } from "react-native";
import General from "../communityScreens/GeneralTab";
import MentalHealth from "../communityScreens/MentalHealthTab";
import WellnessTips from "../communityScreens/WellnessTipsTab";
import Wins from "../communityScreens/WinsTab";
import Advice from "../communityScreens/AdviceTab";

const Tab = createMaterialTopTabNavigator();

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community Discussions</Text>
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: { fontSize: 14, fontFamily: "PatrickHand-Regular" },
          tabBarIndicatorStyle: { backgroundColor: "#6b4c9a" },
          tabBarStyle: { backgroundColor: "#fff0f6" },
        }}
      >
        <Tab.Screen name="General" component={General} />
        <Tab.Screen name="Mental Health" component={MentalHealth} />
        <Tab.Screen name="Wellness Tips" component={WellnessTips} />
        <Tab.Screen name="Wins" component={Wins} />
        <Tab.Screen name="Advice" component={Advice} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f9",
    paddingTop: 70,
  },
  header: {
    fontSize: 27,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    textAlign: "center",
    marginBottom: 10,
  },
});
