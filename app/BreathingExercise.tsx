import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Slider from "@react-native-community/slider"; // 🟣 Add slider
import Header from "@/components/header";
interface BreathingExerciseProps {
  onBack: () => void;
}

export default function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  // 🟣 Adjustable breathing durations (seconds)
  const [inhaleDuration, setInhaleDuration] = useState(4);
  const [holdDuration, setHoldDuration] = useState(2);
  const [exhaleDuration, setExhaleDuration] = useState(4);

  useEffect(() => {
    let timeout1: number;
    let timeout2: number;
    let timeout3: number;
  
    const startBreathingCycle = () => {
      setPhase("Inhale");
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: inhaleDuration * 1000,
        useNativeDriver: true,
      }).start();
  
      timeout1 = setTimeout(() => {
        setPhase("Hold");
        timeout2 = setTimeout(() => {
          setPhase("Exhale");
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: exhaleDuration * 1000,
            useNativeDriver: true,
          }).start();
  
          timeout3 = setTimeout(() => {
            startBreathingCycle(); // restart the whole cycle
          }, exhaleDuration * 1000);
        }, holdDuration * 1000);
      }, inhaleDuration * 1000);
    };
  
    startBreathingCycle();
  
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      fadeAnim.stopAnimation();
    };
  }, [inhaleDuration, holdDuration, exhaleDuration]);
  
  const cyclePhases = () => {
    setPhase((prev) => {
      if (prev === "Inhale") return "Hold";
      if (prev === "Hold") return "Exhale";
      return "Inhale";
    });
  };

  return (
    <>
    <Header title="Breathing Exercise" backPath="/mindfulness" />
      <View style={styles.container}>
  
      <View style={styles.breathingContainer}>
        <Animated.View style={[styles.circle, { opacity: fadeAnim  }]} />
      </View>

      <Text style={styles.instruction}>
        {phase === "Inhale" && "🌬️ Breathe In..."}
        {phase === "Hold" && "⏸️ Hold..."}
        {phase === "Exhale" && "💨 Breathe Out..."}
      </Text>

      {/* 🟣 New: Sliders */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Inhale: {inhaleDuration}s</Text>
        <Slider
          minimumValue={2}
          maximumValue={10}
          step={1}
          value={inhaleDuration}
          onValueChange={setInhaleDuration}
          minimumTrackTintColor="#A084DC"
          maximumTrackTintColor="#ddd"
        />
        <Text style={styles.sliderLabel}>Hold: {holdDuration}s</Text>
        <Slider
          minimumValue={1}
          maximumValue={6}
          step={1}
          value={holdDuration}
          onValueChange={setHoldDuration}
          minimumTrackTintColor="#A084DC"
          maximumTrackTintColor="#ddd"
        />
        <Text style={styles.sliderLabel}>Exhale: {exhaleDuration}s</Text>
        <Slider
          minimumValue={2}
          maximumValue={10}
          step={1}
          value={exhaleDuration}
          onValueChange={setExhaleDuration}
          minimumTrackTintColor="#A084DC"
          maximumTrackTintColor="#ddd"
        />
      </View>
    </View>
    </>
  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5FF", padding: 20 },
  breathingContainer: { width: 300, height: 300, justifyContent: "center", alignItems: "center" },
  circle: {
    width: 200,
    height: 200,
    backgroundColor: "#D6C7F7",
    borderRadius: 100,
  },
  instruction: {
    marginTop: 40,
    fontSize: 24,
    color: "#5A3E9B",
    fontFamily: "PatrickHand-Regular",
    textAlign: "center",
  },
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
  sliderContainer: {
    marginTop: 30,
    width: "90%",
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: "Comfortaa-Regular",
    color: "#5A3E9B",
    marginBottom: 6,
    marginTop: 10,
  },
});
