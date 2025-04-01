import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Nutrition() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.description}>
        Review your achievements and see how far you’ve come on your wellness journey.
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
