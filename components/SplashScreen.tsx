// SplashScreenComponent.tsx
import React, { useEffect } from "react";
import { View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreenComponent({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const run = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay
      await SplashScreen.hideAsync();
      onFinish(); // Tell Index.tsx we're done
    };
    run();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Image
        source={require("../assets/images/vira.gif")}
        style={{ width: 500, height: 500 }}
      />
    </View>
  );
}
