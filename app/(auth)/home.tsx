import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { lightTheme } from "@/config/theme";

export default function AnimatedWelcomeText() {
  // Animated values for opacity and scale.
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Run both animations in parallel.
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.Text
      style={[
        styles.title,
        {
          opacity,
          transform: [{ scale }],
          color: lightTheme.text,
        },
      ]}
    >
      Welcome to Vira!
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});
