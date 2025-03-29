// components/HealthSection.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface BasicQuizProps {
  // New fields:
  name: string;
  setName: (value: string) => void;
  ageGroup: string;
  setAgeGroup: (value: string) => void;
  // Existing health fields:
  physicalHealth: string;
  setPhysicalHealth: (value: string) => void;
  medicalConditions: string;
  setMedicalConditions: (value: string) => void;
  customMedicalConditions: string;
  setCustomMedicalConditions: (value: string) => void;
  mentalDisorder: string;
  setMentalDisorder: (value: string) => void;
  customDisorder: string;
  setCustomDisorder: (value: string) => void;
}

const BasicQuiz: React.FC<BasicQuizProps> = ({
  name,
  setName,
  ageGroup,
  setAgeGroup,
  physicalHealth,
  setPhysicalHealth,
  medicalConditions,
  setMedicalConditions,
  customMedicalConditions,
  setCustomMedicalConditions,
  mentalDisorder,
  setMentalDisorder,
  customDisorder,
  setCustomDisorder,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information & Health</Text>
      
      {/* Name Input */}
      <Text style={styles.question}>
        What’s your name or preferred display name?
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Age Group Input */}
      <Text style={styles.question}>What is your age group?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age group"
        value={ageGroup}
        onChangeText={setAgeGroup}
      />

      {/* Physical Health */}
      <Text style={styles.question}>
        How would you rate your current physical health?
      </Text>
      <View style={styles.optionContainer}>
        {[
          "Very poor",
          "Poor",
          "Average",
          "Good",
          "Excellent",
          "Prefer not to say",
        ].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              physicalHealth === option && styles.selectedOption,
            ]}
            onPress={() => setPhysicalHealth(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Medical Conditions */}
      <Text style={styles.question}>
        Do you have any medical conditions or injuries that might affect exercise choices?
      </Text>
      <View style={styles.optionContainer}>
        {["Yes", "No", "Prefer not to say"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              medicalConditions === option && styles.selectedOption,
            ]}
            onPress={() => setMedicalConditions(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {medicalConditions === "Yes" && (
        <TextInput
          style={styles.input}
          placeholder="Please specify"
          value={customMedicalConditions}
          onChangeText={setCustomMedicalConditions}
        />
      )}

      {/* Mental Disorder */}
      <Text style={styles.question}>
        Have you ever been diagnosed with a mental disorder?
      </Text>
      <View style={styles.optionContainer}>
        {[
          "None of the above",
          "Depression",
          "Anxiety",
          "Bipolar Disorder",
          "Other",
        ].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              mentalDisorder === option && styles.selectedOption,
            ]}
            onPress={() => setMentalDisorder(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {mentalDisorder === "Other" && (
        <TextInput
          style={styles.input}
          placeholder="Please specify"
          value={customDisorder}
          onChangeText={setCustomDisorder}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: "#a0d2eb",
  },
});

export default BasicQuiz;
