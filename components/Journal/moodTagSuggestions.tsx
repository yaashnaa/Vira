import React from "react";
import { View, Text, StyleSheet } from "react-native";

// CBT-guided themes based on mood
const cbtPromptMap: Record<string, string[]> = {
  "Feeling Great": [
    "Document a recent success",
    "Celebrate a positive behavior change",
    "Set a small goal for the week",
    "Track helpful thoughts you had today",
  ],
  "Pretty Good": [
    "What balanced thoughts helped you today?",
    "Reflect on a moment of calm",
    "List things you’re grateful for",
    "Describe a situation you handled well",
  ],
  "Hanging in There": [
    "Identify any thinking traps from today",
    "Write about a challenge and how you coped",
    "What would you say to a friend feeling like this?",
    "What patterns do you notice in your thoughts?",
  ],
  "Not My Best": [
    "Track an unhelpful thought and challenge it",
    "What evidence supports or contradicts your thought?",
    "Can you identify a cognitive distortion?",
    "How did you respond emotionally and behaviorally?",
  ],
  "Having a Tough Day": [
    "What triggered your mood today?",
    "Describe how you felt and why",
    "Was your thought accurate or distorted?",
    "Practice self-kindness: what do you need right now?",
  ],
};

const moodLabels = [
  "Having a Tough Day", // 0
  "Not My Best",        // 1
  "Hanging in There",   // 2
  "Pretty Good",        // 3
  "Feeling Great",      // 4
];

const valueMap: Record<string, number> = {
  "Feeling Great": 0,
  "Pretty Good": 25,
  "Hanging in There": 50,
  "Not My Best": 75,
  "Having a Tough Day": 100,
};

const labelMap: Record<number, string> = {
  0: "Feeling Great",
  25: "Pretty Good",
  50: "Hanging in There",
  75: "Not My Best",
  100: "Having a Tough Day",
};

export default function MoodTagSuggestions({
  mood,
}: {
  mood: string | number;
}) {
  let moodLabel: string | null = null;

  if (typeof mood === "string" && mood in valueMap) {
    moodLabel = mood;
  } else if (!isNaN(Number(mood))) {
    const moodNum = Number(mood);
  
    
    if (labelMap[moodNum]) {
      moodLabel = labelMap[moodNum];
    } 
    // Then try index-based fallback
    else if (moodNum >= 0 && moodNum < moodLabels.length) {
      moodLabel = moodLabels[moodNum];
    }
  }
  
  if (!moodLabel || !(moodLabel in cbtPromptMap)) {
    console.warn("⚠️ Invalid or unmapped mood passed:", mood);
    return null;
  }

  const suggestions = cbtPromptMap[moodLabel];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🧠 CBT Prompt Ideas for "{moodLabel}"</Text>
      <View style={styles.tagList}>
        {suggestions.map((tag) => (
          <Text key={tag} style={styles.tag}>
            • {tag}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a3147",
    fontFamily: "Main-font",
    marginBottom: 6,
    marginTop: 10,
  },
  tagList: {
    flexDirection: "column",
    gap: 6,
  },
  tag: {
    fontSize: 14,
    color: "#3e2a6e",
    backgroundColor: "#f4ecf7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    fontFamily: "Main-font",
  },
});
