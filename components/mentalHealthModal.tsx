import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Checkbox, Button, Menu } from "react-native-paper";

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
  const [showMentalMenu, setShowMentalMenu] = useState(false);

  const toggleOption = (option: string) => {
    setMentalDisorder((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.label}>Mental Health Conditions</Text>

      <Menu
        visible={showMentalMenu}
        onDismiss={() => setShowMentalMenu(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setShowMentalMenu(true)}
            style={styles.dropdown}
          >
            <Text style={{ color: mentalDisorder.length ? "#000" : "#888" }}>
              {mentalDisorder.length > 0
                ? mentalDisorder.join(", ")
                : "Select conditions (optional)"}
            </Text>
          </TouchableOpacity>
        }
      >
        {[
          "Depression",
          "Anxiety",
          "Bipolar Disorder",
          "Post-Traumatic Stress Disorder (PTSD)",
          "Eating Disorder",
          "Obsessive-Compulsive Disorder (OCD)",
          "None of the above",
          "Prefer not to say",
          "Other",
        ].map((option) => (
          <Menu.Item
            key={option}
            title={
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={
                    mentalDisorder.includes(option) ? "checked" : "unchecked"
                  }
                  onPress={() => {
                    setMentalDisorder((prev) =>
                      prev.includes(option)
                        ? prev.filter((item) => item !== option)
                        : [...prev, option]
                    );
                  }}
                />
                <Text>{option}</Text>
              </View>
            }
            onPress={() => {
              setMentalDisorder((prev) =>
                prev.includes(option)
                  ? prev.filter((item) => item !== option)
                  : [...prev, option]
              );
            }}
          />
        ))}
      </Menu>

      {mentalDisorder.includes("Other") && (
        <>
          <Text style={styles.label}>Custom Mental Health Condition</Text>
          <TextInput
            style={styles.input}
            value={customDisorder}
            onChangeText={setCustomDisorder}
            placeholder="Please specify"
          />
        </>
      )}
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
