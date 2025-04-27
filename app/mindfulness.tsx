import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BreathingExercise from "@/components/mindfullness/BreathingExercise";
import BodyScanExercise from "@/components/mindfullness/BodyScanExercise";
import FiveSensesExercise from "@/components/mindfullness/FiveSensesExercise";

export default function MindfulnessScreen() {
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);

  if (selectedTechnique === "Breathing") return <BreathingExercise onBack={() => setSelectedTechnique(null)} />;
  if (selectedTechnique === "BodyScan") return <BodyScanExercise onBack={() => setSelectedTechnique(null)} />;
  if (selectedTechnique === "FiveSenses") return <FiveSensesExercise onBack={() => setSelectedTechnique(null)} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧘 Mindfulness Exercises</Text>

      <TouchableOpacity style={styles.button} onPress={() => setSelectedTechnique("Breathing")}>
        <Text style={styles.buttonText}>🌬️ Breathing Exercise</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setSelectedTechnique("BodyScan")}>
        <Text style={styles.buttonText}>🛌 Body Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setSelectedTechnique("FiveSenses")}>
        <Text style={styles.buttonText}>👁️ Five Senses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, fontFamily: "PatrickHand-Regular" },
  button: { backgroundColor: "#D6C7F7", padding: 15, marginVertical: 10, borderRadius: 12, width: "80%", alignItems: "center" },
  buttonText: { fontSize: 18, color: "#432371", fontFamily: "Main-font" },
});
