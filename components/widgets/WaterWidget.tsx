import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WaterWidgetProps {
  onRemove?: () => void;
}

const WaterWidget: React.FC<WaterWidgetProps> = ({ onRemove }) => {
  const router = useRouter();
  const [waterDrank, setWaterDrank] = useState(0);
  const [waterGoal, setWaterGoal] = useState(3000);

  useEffect(() => {
    const fetchData = async () => {
      const storedDrank = await AsyncStorage.getItem("@amount");
      const storedGoal = await AsyncStorage.getItem("@goal");

      if (storedDrank) setWaterDrank(Number(storedDrank));
      if (storedGoal) setWaterGoal(Number(storedGoal));
    };

    fetchData();
  }, []);

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
        title="Water Tracker"
        subtitle={`${waterDrank} / ${waterGoal} mL`}
        imageSource={require("../../assets/images/widgetImages/water.png")}
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

export default WaterWidget;
