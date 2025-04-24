import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager, Linking } from "react-native";
import { Icon } from "react-native-paper";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CBTExplanationSection() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>What is a CBT Thought Record?</Text>
        <Icon source={expanded ? "chevron-up" : "chevron-down"} size={20} color="#6a4c93" />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          <Text style={styles.body}>
            A Cognitive Behavioral Therapy (CBT) Thought Record is a tool to help identify and challenge unhelpful
            thinking patterns. It guides you through recognizing automatic thoughts, labeling distortions, and reframing them
            with more balanced thinking.
          </Text>
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL("https://www.therapistaid.com/therapy-worksheet/cbt-thought-record")
            }
          >
            Source: TherapistAid.com
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FAE1DD",
    padding: 12,
    borderRadius: 10,
  },
  title: {
    fontFamily: "PatrickHand-Regular",
    fontSize: 16,
    color: "#301101",
  },
  content: {
    padding: 12,
    backgroundColor: "#FAE1DD",
    borderRadius: 10,
    marginTop: 8,
  },
  body: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#333",
  },
  link: {
    marginTop: 10,
    fontSize: 13,
    color: "#6a4c93",
    textDecorationLine: "underline",
  },
});
