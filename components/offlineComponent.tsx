import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OfflineNotice() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're Offline</Text>
      <Text style={styles.message}>
        Please connect to the internet to access all features of Vira.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff0f3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9b5de5',
    marginBottom: 10,
    fontFamily: 'PatrickHand-Regular',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    fontFamily: 'Main-font',
  },
});
