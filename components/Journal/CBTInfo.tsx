// components/Journal/CBTJournalingInfo.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView, 
} from "react-native";
import { Icon } from "react-native-paper";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CBTJournalingInfo() {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(!expanded);
  };

  const prompts = [
    "1. **Thought recording**: Note situations that trigger strong emotions.",
    "2. **Identifying distortions**: Spot “all-or-nothing,” “catastrophizing,” etc.",
    "3. **Challenging thoughts**: Weigh evidence for/against the thought.",
    "4. **Alternative perspectives**: What’s a more balanced interpretation?",
    "5. **Behavior tracking**: Monitor how you reacted and what you did next.",
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} style={styles.headerRow}>
        <Text style={styles.headerText}>What is CBT Journaling?</Text>
        <Icon source={expanded ? "chevron-up" : "chevron-down"} size={24} />
      </TouchableOpacity>

      {expanded && (
        <ScrollView style={styles.content}>
          <Text style={styles.paragraph}>
            Cognitive behavioral therapy (CBT) journaling is a structured way to
            track your thoughts, emotions, and behaviors. By recording automatic
            thoughts and identifying cognitive distortions, you learn to
            challenge and reframe them, promoting healthier thinking and
            emotional well‑being. While self‑guided journaling can help, pairing
            it with a trained therapist often yields the best results.
          </Text>

          <Text style={styles.subHeader}>Key Steps:</Text>
          {prompts.map((p) => (
            <Text key={p} style={styles.promptText}>
              {p}
            </Text>
          ))}

          <Text style={styles.note}>
            *Not a substitute for professional care. If you’re struggling,
            please reach out to a mental health professional.*
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: "#f4f0f8",
    borderRadius: 12,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#e6dbf5",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4e2a7e",
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    fontFamily: "Main-font",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4e2a7e",
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    fontFamily: "Main-font",
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
  },
});
