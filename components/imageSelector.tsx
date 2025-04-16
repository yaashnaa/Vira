import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

interface ImageSelectorProps {
  options: { label: string; image: any }[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

export default function ImageSelector({
  options,
  selectedOption,
  onSelect,
}: ImageSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(option.label)}
          style={[
            styles.option,
            selectedOption === option.label && styles.selected,
          ]}
        >
          <Image source={option.image} style={styles.image} />
       
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 0,
    marginVertical: 10,
  },
  option: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#A084DC",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    fontFamily: "Main-font",
  },
});
