import React from 'react';
import { useRouter } from "expo-router";
import WidgetCard from "../widgetCard";
import { Feather } from "@expo/vector-icons";

import { Pressable, StyleSheet, View } from "react-native";

interface FitnessWidgetProps {
  onRemove?: () => void;
}

const FitnessWidget: React.FC<FitnessWidgetProps> = ({ onRemove }) => {
  const router = useRouter();
  const handlePress = () => {
    router.replace("/fitness/(tabs)/explore");
  };

  return (
    <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
           <Feather name="minus-circle" color="#c13e6a" size={20} />
        </Pressable>
      )}
      <WidgetCard
        title="Fitness"
        imageSource={require('../../assets/images/widgetImages/triangle.png')}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  removeIcon: {
    position: "absolute",
    top: 18,
    left: 100,
    zIndex: 1,
  },
});

export default FitnessWidget;
