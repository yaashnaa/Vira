import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // for arrow
import Header from "@/components/header";

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
  const [expanded, setExpanded] = useState(false);

  const handleNext = () => {
    if (currentStep < prompts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // restart
    }
  };

  return (
    <>
      <Header title="Five Senses Grounding" backPath="/mindfulness" />
      <View style={styles.container}>
        {/* Expandable Section */}
        <TouchableOpacity style={styles.expandButton} onPress={() => setExpanded((prev) => !prev)}>
          <Text style={styles.expandButtonText}>
            {expanded ? "Hide Info" : "What is Five Senses Grounding?"}
          </Text>
          <AntDesign name={expanded ? "up" : "down"} size={20} color="#5A3E9B" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.infoText}>
              Five Senses Grounding is a calming technique that helps you reconnect with the present moment
              by paying attention to your senses. It's especially helpful during anxiety, stress, or overwhelm. 🌿
            </Text>
          </View>
        )}

        {/* Main Exercise */}
        <View style={{marginTop: expanded ? 20 : 40}}>
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
 

    
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#efecfe", padding: 20 },
  expandButton: {
    // marginTop: 20,
    backgroundColor: "#E4DFFD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  expandButtonText: {
    fontSize: 16,
    color: "#5A3E9B",
    fontFamily: "Main-font",  
  },
  expandedContent: {
    marginTop: 10,
    backgroundColor: "#faf7ff",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Main-font",  
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "PatrickHand-Regular",
    color: "#211506",
    marginTop: 30,
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
    color: "#200704",
    marginBottom: 10,
    fontFamily: "PatrickHand-Regular",
  },
  instruction: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 20,
    fontFamily: "Main-font",
  },
  nextButton: {
    backgroundColor: "#E4DFFD",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
    width: "80%",
    alignSelf: "center",
    
  },
  nextButtonText: {
    color: "#040301",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Main-font",  
    textAlign: "center",
  },
});
