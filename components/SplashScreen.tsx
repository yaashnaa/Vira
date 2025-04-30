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
    const prepareSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.error("Error preventing splash hide:", e);
      }
    };
    prepareSplash();
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      onFinish();
      SplashScreen.hideAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../assets/images/vira.mp4")}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping={false} // 🔥 important: not looping anymore
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate} // 🟣 listen for finish
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
