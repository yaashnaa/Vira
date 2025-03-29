// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { resetOnboarding } from '../../utils/resetOnboarding';
import LogoutButton from '@/components/logoutButton';
export default function Dashboard() {
  const router = useRouter();

  const handleLogMeal = () => {
    // Navigate to the meal logging screen
    router.push('/nurtition');
  };

  const handlePersonalize = () => {
    router.push('/quizzes/screening');
  }


  const handleLogMood = () => {
    // Navigate to the mood logging screen or daily check-in
    router.push('/');
  };

  const handleStartWorkout = () => {
    // Navigate to the fitness/workout screen
    router.push('/fitness');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <View style={styles.snapshotContainer}>
        <Text style={styles.snapshotTitle}>Today's Snapshot</Text>
        <Text style={styles.snapshotText}>Mood: Good</Text>
        <Text style={styles.snapshotText}>Steps: 3,500</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogMeal}>
          <Text style={styles.buttonText}>Log Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogMood}>
          <Text style={styles.buttonText}>Log Mood</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleStartWorkout}>
          <Text style={styles.buttonText}>Log Workout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationTitle}>Today's Recommendation</Text>
        <Text style={styles.recommendationText}>
          Try our gentle yoga routine for a refreshing start!
        </Text>
      </View>
      <View style={styles.container}>
      <Button title="Reset Onboarding" onPress={resetOnboarding} />
      <Button title="Personalise" onPress={handlePersonalize} />
      <LogoutButton />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  snapshotContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  snapshotTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  snapshotText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  recommendationContainer: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 16,
  },
});
