import React, { useEffect } from "react";
import { View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreenComponent({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const hideSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 sec
      await SplashScreen.hideAsync();
      onFinish(); // Calls function to transition to onboarding
    };
    hideSplash();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
      <Image source={require("../assets/images/vira.gif")} style={{ width: 500, height: 500 }} />
    </View>
  );
}
