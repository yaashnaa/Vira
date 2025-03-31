// BasicButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { lightTheme } from "@/config/theme";

interface BasicButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

const BasicButton: React.FC<BasicButtonProps> = ({ children, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "60%",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 3,
    borderColor: lightTheme.accent,
    borderStyle: "solid",
    shadowColor: lightTheme.secondary,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 2,
  },
});

export default BasicButton;
