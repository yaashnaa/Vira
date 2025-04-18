import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
} from "react-native";
import { Checkbox, Button } from "react-native-paper";

const mentalHealthOptions = [
  "Depression",
  "Anxiety",
  "Bipolar Disorder",
  "Post-Traumatic Stress Disorder (PTSD)",
  "Eating Disorder",
  "Obsessive-Compulsive Disorder (OCD)",
  "None of the above",
  "Prefer not to say",
  "Other",
];

export default function MentalHealthCheckboxModal({
  mentalDisorder,
  setMentalDisorder,
  customDisorder,
  setCustomDisorder,
}: {
  mentalDisorder: string[];
  setMentalDisorder: React.Dispatch<React.SetStateAction<string[]>>;
  customDisorder: string;
  setCustomDisorder: (value: string) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleOption = (option: string) => {
    setError(""); // clear previous error

    setMentalDisorder((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Animate custom input if "Other" is selected
  useEffect(() => {
    if (mentalDisorder.includes("Other")) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setCustomDisorder(""); // reset custom input if "Other" is unchecked
    }
  }, [mentalDisorder]);

  const handleDone = () => {
    if (mentalDisorder.includes("Other") && !customDisorder.trim()) {
      setError("Please provide a description for 'Other'");
      return;
    }

    setShowModal(false);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.label}>
        Diagnosed or self-identified mental health conditions
        <Text style={{ fontWeight: "normal" }}>(Select all that apply)</Text>
      </Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowModal(true)}
      >
        <Text
          style={{
            color:
              Array.isArray(mentalDisorder) && mentalDisorder.length > 0
                ? "#000"
                : "#888",
          }}
        >
          {Array.isArray(mentalDisorder) && mentalDisorder.length > 0
            ? mentalDisorder.join(", ")
            : "Select your mental health conditions"}
        </Text>
      </TouchableOpacity>


      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select mental health conditions
            </Text>
            <ScrollView>
              {mentalHealthOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => toggleOption(option)}
                  style={styles.option}
                >
                  <Checkbox
                    status={
                      mentalDisorder.includes(option) ? "checked" : "unchecked"
                    }
                  />
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}

              {mentalDisorder.includes("Other") && (
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text
                    style={[
                      styles.label,
                      { fontWeight: "normal", fontSize: 14 },
                    ]}
                  >
                    Describe it in your own words:
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={customDisorder}
                    onChangeText={setCustomDisorder}
                    placeholder="Optional"
                  />
                </Animated.View>
              )}

              {error !== "" && <Text style={styles.error}>{error}</Text>}
            </ScrollView>

            <Button mode="contained" onPress={handleDone}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    padding: 12,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  input: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginTop: 6,
    marginBottom: 10,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
