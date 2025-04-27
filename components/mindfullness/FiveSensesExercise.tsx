import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

interface FiveSensesExerciseProps {
  onBack: () => void;
}

const prompts = [
  { sense: "See", instruction: "Notice 5 things you can see." },
  { sense: "Hear", instruction: "Notice 4 things you can hear." },
  { sense: "Feel", instruction: "Notice 3 things you can feel." },
  { sense: "Smell", instruction: "Notice 2 things you can smell." },
  { sense: "Taste", instruction: "Notice 1 thing you can taste." },
];

export default function FiveSensesExercise({ onBack }: FiveSensesExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < prompts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // restart if needed
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Five Senses Grounding</Text>

      <View style={styles.promptContainer}>
        <Text style={styles.senseTitle}>{prompts[currentStep].sense}</Text>
        <Text style={styles.instruction}>{prompts[currentStep].instruction}</Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentStep === prompts.length - 1 ? "Restart" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E9F8F9", padding: 20 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#B7E4C7",
    padding: 8,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#14532d",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontFamily: "PatrickHand-Regular",
    color: "#065f46",
    marginBottom: 10,
    textAlign: "center",
  },
  promptContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  senseTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 10,
    fontFamily: "PatrickHand-Regular",
  },
  instruction: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 20,
    fontFamily: "Comfortaa-Regular",
  },
  nextButton: {
    backgroundColor: "#A7F3D0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
  },
  nextButtonText: {
    color: "#065f46",
    fontSize: 18,
    fontWeight: "bold",
  },
});
