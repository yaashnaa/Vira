import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, LogBox } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as SplashScreen from "expo-splash-screen";

const { width } = Dimensions.get("window");
LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components",
  "Text strings must be rendered within a <Text> component."
]);
interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreenComponent({ onFinish }: SplashScreenProps) {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const run = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 4000)); // wait 2 seconds
        onFinish(); // Signal to the app that splash is done
        await SplashScreen.hideAsync(); // Now hide splash screen
      } catch (e) {
        console.error("Error during splash screen logic:", e);
      }
    };

    run();
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/images/Vira.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        useNativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width,
    height: width,
  },
});
