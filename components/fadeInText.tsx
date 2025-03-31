import React, { useEffect, useRef } from "react";
import { Animated, TextStyle } from "react-native";

interface FadeInTextProps {
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

const FadeInText: React.FC<FadeInTextProps> = ({ style, children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // initial opacity is 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // fade to opaque
      duration: 4000, // duration in milliseconds
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.Text style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.Text>
  );
};

export default FadeInText;
