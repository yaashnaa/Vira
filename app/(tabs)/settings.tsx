import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { useUserPreferences } from '../../context/userPreferences'; // Adjust the import path as necessary

export default function Settings() {
  // Get current preferences and the updater function from the context.
  const { userPreferences, updatePreferences } = useUserPreferences();

  // Create local state for each setting you'd like to allow changes.
  // Initialize these states from the context value.
  const [name, setName] = useState(userPreferences.name);
  const [ageGroup, setAgeGroup] = useState(userPreferences.ageGroup);
  const [activityLevel, setActivityLevel] = useState(userPreferences.activityLevel);
  
  // Add more state variables as needed...

  // If the context value might change while the user is on this screen,
  // you can update the local state accordingly:
  useEffect(() => {
    setName(userPreferences.name);
    setAgeGroup(userPreferences.ageGroup);
    setActivityLevel(userPreferences.activityLevel);
    // and so on...
  }, [userPreferences]);

  // Save changes back to the context when the user presses "Save"
  const handleSave = () => {
    updatePreferences({
      name,
      ageGroup,
      activityLevel,
      // Include any additional fields here...
    });
    // Optionally, show a confirmation message or navigate away.
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Age Group</Text>
      <TextInput
        style={styles.input}
        value={ageGroup}
        onChangeText={setAgeGroup}
        placeholder="Enter your age group"
      />

      <Text style={styles.label}>Activity Level</Text>
      <TextInput
        style={styles.input}
        value={activityLevel}
        onChangeText={setActivityLevel}
        placeholder="Describe your activity level"
      />

      {/* You can add more input fields for other preferences here */}

      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
});
