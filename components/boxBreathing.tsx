import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Slider from "@react-native-community/slider";

export default function BoxBreathingScreen() {
  const [inhaleDuration, setInhaleDuration] = useState(4); // seconds
  const [holdDuration, setHoldDuration] = useState(4); // seconds

  const webAppURL = `https://yaashnaa.github.io/BoxBreathing/?inhale=${inhaleDuration}&hold=${holdDuration}`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Inhale Duration: {inhaleDuration}s</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={inhaleDuration}
        onValueChange={setInhaleDuration}
      />
      <Text style={styles.label}>Hold Duration: {holdDuration}s</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={holdDuration}
        onValueChange={setHoldDuration}
      />
      <WebView
        originWhitelist={["*"]}
        source={{ uri: webAppURL }}
        style={styles.webview} allowsFullscreenVideo scalesPageToFit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#fff0f6",
  },
  slider: {
    width: Dimensions.get("window").width - 40,
    height: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    color: "#3e2a6e",
    fontFamily: "PatrickHand-Regular",
  },
  webview: {
    flex: 1,
    marginTop: 10,
  },
});
