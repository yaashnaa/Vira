import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";

interface BodyScanExerciseProps {
  onBack: () => void;
}

const bodyParts = [
  "Top of Head",
  "Forehead",
  "Eyes",
  "Jaw",
  "Neck and Shoulders",
  "Arms and Hands",
  "Chest",
  "Stomach",
  "Hips",
  "Legs",
  "Feet",
];

export default function BodyScanExercise({ onBack }: BodyScanExerciseProps) {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    animate();
    const interval = setInterval(() => {
      setCurrentPartIndex((prev) => (prev + 1) % bodyParts.length);
      animate();
    }, 5000); // change body part every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const animate = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Body Scan</Text>
        <Text style={styles.instruction}>
          Focus gently on your...
        </Text>
        <Text style={styles.bodyPart}>
          {bodyParts[currentPartIndex]}
        </Text>
      </Animated.View>

      <Text style={styles.helperText}>
        Notice any sensations — warmth, tingling, relaxation.  
        No need to change anything, just observe. 🌿
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5FF", padding: 20 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#E4DFFD",
    padding: 8,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#5A3E9B",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontFamily: "PatrickHand-Regular",
    color: "#5A3E9B",
    marginBottom: 10,
    textAlign: "center",
  },
  instruction: {
    fontSize: 20,
    color: "#5A3E9B",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  bodyPart: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#865DFF",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "PatrickHand-Regular",
  },
  helperText: {
    marginTop: 40,
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
});
