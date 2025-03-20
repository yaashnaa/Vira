// TrackScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Setup() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setup</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
