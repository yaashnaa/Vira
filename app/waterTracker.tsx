import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { AddRemoveButton } from "../components/addRemoveButton";

import { IconButton, MD3Colors } from "react-native-paper";
import { useRouter } from "expo-router";

const amounts = [250, 500, 1000, 1500];

const storeData = async ({
  value,
  key = "@amount",
}: {
  value: string;
  key?: string;
}) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

const getData = async ({
  key,
  setValue,
}: {
  key: string;
  setValue: (value: number) => void;
}) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      setValue(Number(value));
    }
  } catch (e) {
    console.log(e);
  }
};

export default function WaterTrackerScreen() {
  const [fillingPercentage, setFillingPercentage] = useState(0);
  const [waterGoal, setWaterGoal] = useState(3000);
  const [waterDrank, setWaterDrank] = useState(0);
  const [isGoalAchieved, setIsGoalAchieved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const barHeight = useRef(new Animated.Value(0)).current;

  const progressPercent = barHeight.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const getMoodImage = () => {
    const percentage = (waterDrank * 100) / waterGoal;
    if (percentage >= 90) {
      return require("../assets/images/water/5.png");
    } else if (percentage >= 75) {
      return require("../assets/images/water/4.png");
    } else if (percentage >= 50) {
      return require("../assets/images/water/3.png");
    } else if (percentage >= 25) {
      return require("../assets/images/water/2.png");
    } else {
      return require("../assets/images/water/1.png");
    }
  };

  useEffect(() => {
    getData({ key: "@amount", setValue: setWaterDrank });
    getData({ key: "@goal", setValue: setWaterGoal });
  }, []);

  useEffect(() => {
    Animated.timing(barHeight, {
      duration: 1000,
      toValue: fillingPercentage / 3,
      useNativeDriver: false,
    }).start();
  }, [fillingPercentage]);

  useEffect(() => {
    storeData({ value: waterGoal.toString(), key: "@goal" });
  }, [waterGoal]);

  useEffect(() => {
    storeData({ value: waterDrank.toString(), key: "@amount" });
  }, [waterDrank]);

  useEffect(() => {
    const percentage = (waterDrank * 100) / waterGoal;
    const fillingP = (percentage * 300) / 100;
    setFillingPercentage(fillingP > 300 ? 300 : fillingP);
  }, [waterGoal, waterDrank]);

  useEffect(() => {
    if (waterDrank >= waterGoal && !isGoalAchieved) {
      setIsGoalAchieved(true);
      setShowConfetti(true);
    } else if (waterDrank < waterGoal && isGoalAchieved) {
      setIsGoalAchieved(false);
    }
  }, [waterDrank, isGoalAchieved, waterGoal]);

  const handleBackPress = () => {
    router.replace("/dashboard");
  };

  const hydrationTips = [
    "💡 Tip: Start your day with a glass of water!",
    "💡 Tip: Add fruits like lemon or cucumber for flavor!",
    "💡 Tip: Keep a bottle near you at all times.",
    "💡 Tip: Drink a glass before every meal!",
  ];
  const randomTip =
    hydrationTips[Math.floor(Math.random() * hydrationTips.length)];

  return (
    <>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb",
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#150b01" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "WATER TRACKER",
          style: {
            color: "#13100d",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
      />

      <SafeAreaView style={styles.container}>
        {showConfetti && (
          <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut />
        )}

        <Text style={styles.tip}>{randomTip}</Text>

        <View style={styles.waterGoalContainer}>
          <Text style={styles.brownTitle}>Your Goal:</Text>
          <View style={styles.goalRow}>
            <IconButton
              icon={() => (
                <Ionicons name="add-circle" size={25} color="#472608" />
              )}
              onPress={() => setWaterGoal(waterGoal + 250)}
              style={{ marginLeft: 0, marginRight: 0 }}
            />
            <Text style={styles.goalText}>{waterGoal} mL</Text>

            <IconButton
              icon={() => (
                <Ionicons name="remove-circle" size={25} color="#472608" />
              )}
              onPress={() => setWaterGoal(waterGoal - 250)}
              style={{ marginLeft: 0, marginRight: 0 }}
            />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.characterContainer}>
            <Image source={getMoodImage()} style={styles.character} />
            <View>
              <Text style={styles.label}>You've drunk</Text>
              <Text style={styles.amount}>{waterDrank} mL</Text>
              <Text style={styles.label}>of water</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <Animated.View
              style={{
                height: progressPercent,
                backgroundColor: "#79dae8",
                borderRadius: 40,
              }}
            />
          </View>
        </View>

        <View style={styles.waterButtonsContainer}>
          {amounts.map((amount) => (
            <AddRemoveButton
              key={`add-${amount}`}
              amount={amount}
              value={waterDrank}
              setValue={setWaterDrank}
              operation="add"
            />
          ))}
        </View>

        <View style={styles.waterButtonsContainer}>
          {amounts.map((amount) => (
            <AddRemoveButton
              key={`remove-${amount}`}
              amount={amount}
              value={waterDrank}
              setValue={setWaterDrank}
              operation="subtract"
            />
          ))}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f4",
    alignItems: "center",
  },
  character: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginTop: 10,
  },
  tip: {
    fontSize: 16,
    color: "#5a4137",
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "Main-font",
    marginTop: 40,
  },
  waterGoalContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    margin: "auto",
    // paddingVertical: 30,
  },
  brownTitle: {
    fontSize: 22,
    marginRight: 10,
    color: "#150b01",
    fontWeight: "600",
    fontFamily: "Main-font",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    // marginTop: 10,
  },
  goalText: {
    fontSize: 22,
    // fontWeight: "600",
    color: "#333",
    fontFamily: "Main-font",
  },
  progressSection: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  progressBarContainer: {
    borderRadius: 40,
    borderWidth: 1,
    width: 40,
    height: 300,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderColor: "#e2d6cc",
  },
  characterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    fontSize: 22,
    fontFamily: "PatrickHand-Regular",
    color: "#150b01",
    textAlign: "center",
  },
  amount: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#53aebc",
    textAlign: "center",
  },
  waterButtonsContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    width: "90%",
    justifyContent: "space-between",
  },
});
