import React from 'react';
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";

interface NutritionWidgetProps {
  onRemove?: () => void;
}

const NutritionWidget: React.FC<NutritionWidgetProps> = ({ onRemove }) => {
 
    const router = useRouter();
    const handlePress = () => {
         router.replace("/nurtition");
    };

    return (
      <View style={styles.container}>
            {onRemove && (
              <Pressable onPress={onRemove} style={styles.removeIcon}>
                <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
              </Pressable>
            )}
        <WidgetCard
        title="Nutrition"
        imageSource={require('../../assets/images/widgets/diet.png')}
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


export default NutritionWidget;