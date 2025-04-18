import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useRouter } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";

import MoodLogger from "@/components/moodLog"; // update the path as needed
import MoodCalendar from "@/components/moodCalender"; // update the path as needed

export default function Mood() {
  const [selectedSegment, setSelectedSegment] = useState("log");
  const router = useRouter();

  const handleBackPress = () => {
    router.replace("/dashboard");
  };

  return (
    <>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb",
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#271949" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "MOOD TRACKER",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={handleBackPress}
            >
              <Icon name="settings" size={25} type="feather" color="#271949" />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.container}>
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={setSelectedSegment}
          buttons={[
            { value: "log", label: "Log Mood", icon: "pencil" },
            { value: "calendar", label: "Mood Calendar", icon: "calendar" },
          ]}
        />

        {selectedSegment === "log" && <MoodLogger />}
        {selectedSegment === "calendar" && <MoodCalendar />}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerRight: {
    flexDirection: "row",
    marginTop: 5,
  },
});
