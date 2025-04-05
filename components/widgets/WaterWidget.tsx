import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

interface WaterWidgetProps {
  onRemove?: () => void;
}

const WaterWidget: React.FC<WaterWidgetProps> = ({ onRemove }) => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/waterTracker");
    };

    return (
      <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
          <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
        </Pressable>
      )}
        <WidgetCard
        title="Water tracker"
        imageSource={require('../../assets/images/widgets/water.png')}
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


export default WaterWidget;