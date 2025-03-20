import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MindfulnessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mindfulness & Relaxation</Text>
      <Text style={styles.description}>
        Find guided meditations, breathing exercises, and tips for mental well-being.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});
