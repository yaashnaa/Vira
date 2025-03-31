import React, { act, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useUserPreferences } from "../../context/userPreferences";
import { useRouter } from "expo-router";

export default function BasicQuiz() {
  const { updatePreferences, userPreferences } = useUserPreferences();
  const router = useRouter();
    const [error, setError] = useState("");

  // Other state variables...
  const [medicalConditionsInput, setMedicalConditionsInput] = useState(""); // User enters comma-separated conditions

  const [name, setName] = useState(userPreferences.name);
  const [ageGroup, setAgeGroup] = useState(userPreferences.ageGroup);
  const [activityLevel, setactivityLevel] = useState(
    userPreferences.physicalHealth
  );
  const [medicalConditions, setMedicalConditions] = useState("");
  // For mental disorder, etc.
  const [mentalDisorder, setMentalDisorder] = useState(
    userPreferences.mentalHealthConditions
  );
  const [customDisorder, setCustomDisorder] = useState(
    userPreferences.customMentalHealthConditions
  );

  const [customMedicalConditions, setCustomMedicalConditions] = useState(
    userPreferences.customMedicalConditions
  );
  const handleSubmit = () => {
    if (!name.trim()) {
      setError("This field is required.");
      return;
    }
    // Proceed with form submission
    console.log("Submitted value:", name);
    handleNext();
  };

  let finalMedicalConditions: string[] = [];
  if (medicalConditions === "Yes" && customMedicalConditions.trim()) {
    finalMedicalConditions.push(customMedicalConditions.trim());
  } else if (medicalConditions === "No") {
    finalMedicalConditions = ["None"];
  } else if (medicalConditions === "Prefer not to say") {
    finalMedicalConditions = ["Prefer not to say"];
  }
  let finalMentalHealthConditions: string[] = [];
    if (
      !mentalDisorder.includes("None of the above") &&
      !mentalDisorder.includes("Prefer not to say") &&
      mentalDisorder
    ) {
      finalMentalHealthConditions.push(mentalDisorder.join(", "));
    }
    // If user typed a customDisorder:
    if (mentalDisorder.includes("Other") && customDisorder.trim()) {
      finalMentalHealthConditions.push(customDisorder.trim());
    }

  const handleNext = () => {
    // Parse the comma-separated input into an array
    const medicalConditionsArray = medicalConditionsInput
      .split(",")
      .map((cond) => cond.trim())
      .filter((cond) => cond !== "");

    updatePreferences({
      name,
      ageGroup,
      activityLevel,
      medicalConditions: finalMedicalConditions,
      mentalHealthConditions: finalMentalHealthConditions,
      customMentalHealthConditions: customDisorder,
    });
    // Navigate to next quiz or dashboard
    router.push("/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.section}>
        <Text style={styles.sectionTitle}>Health Quiz</Text>
        <Text style={styles.question}>
          What’s your name or preferred display name?
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (text.trim()) {
              setError("");
            }
          }}
        />
         {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.question}>What is your age group?</Text>
        <View style={styles.optionContainer}>
          {[
            "Under 18",
            "18–25",
            "26–40",
            "41–55",
            "56+",
            "Prefer not to say",
          ].map((group) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.optionButton,
                ageGroup === group && styles.selectedOption,
              ]}
              onPress={() => setAgeGroup(group)}
            >
              <Text>{group}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.question}>
          How would you rate your current physical health?
        </Text>
        <View style={styles.optionContainer}>
          {[
            "Sedentary (little or no exercise)",
            "Lightly active (1–3 days/week)",
            "Moderately active (3–5 days/week)",
            "Very active (6–7 days/week)",
            "Prefer not to say",
          ].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                activityLevel === level && styles.selectedOption,
              ]}
              onPress={() => setactivityLevel(level)}
            >
              <Text>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.question}>
          List any medical conditions or injuries (separate with commas)
        </Text>
        <View>
          <Text style={styles.question}>
            Do you have any medical conditions or injuries that might affect
            exercise choices?
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
          {medicalConditions.includes("Yes") && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={customMedicalConditions}
              onChangeText={setCustomMedicalConditions}
            />
          )}
        </View>
        <Text style={styles.question}>
          Have you been diagnosed with a mental disorder? (Type 'Other' to
          specify)
        </Text>
        <View>
          <Text style={styles.question}>
            Have you ever been diagnosed with (or do you suspect) any of the
            following?
          </Text>
          <View style={styles.optionContainer}>
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
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  mentalDisorder.includes(option) && styles.selectedOption,
                ]}
                onPress={() =>
                  setMentalDisorder((prev) =>
                    prev.includes(option)
                      ? prev.filter((item) => item !== option)
                      : [...prev, option]
                  )
                }
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {mentalDisorder.includes("Other") && (
            <TextInput
              style={styles.input}
              placeholder="Please specify"
              value={customDisorder}
              onChangeText={setCustomDisorder}
            />
          )}
        </View>
        <View style={styles.navigationButtons}>
          <Button title="Next" onPress={handleSubmit} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
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
  optionText: {
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disclaimerContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  disclaimerText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  consentButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  consentButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  selectedConsentButton: {
    backgroundColor: "#a0d2eb",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
