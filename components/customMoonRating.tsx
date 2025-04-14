// components/CustomMoonRating.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomMoonRatingProps {
  rating: number;
  onChange: (value: number) => void;
}

const CustomMoonRating: React.FC<CustomMoonRatingProps> = ({
  rating,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((val) => (
        <TouchableOpacity key={val} onPress={() => onChange(val)}>
          <Text style={[styles.moon, rating >= val && styles.selectedMoon]}>
            🌕
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
    alignItems: "center",

    flexDirection: "row",
    justifyContent: "space-between",
  },
  moon: {
    fontSize: 32,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  selectedMoon: {
    opacity: 1,
  },
});

export default CustomMoonRating;
