import React from 'react';
import { useRouter } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

interface FitnessWidgetProps {
  onRemove?: () => void;
}

const FitnessWidget: React.FC<FitnessWidgetProps> = ({ onRemove }) => {
  const router = useRouter();
  const handlePress = () => {
    router.replace("/fitness");
  };

  return (
    <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
          <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
        </Pressable>
      )}
      <WidgetCard
        title="Fitness"
        imageSource={require('../../assets/images/widgets/triangle.png')}
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
    top: 25,
    right: 19,
    zIndex: 1,
  },
});

export default FitnessWidget;
