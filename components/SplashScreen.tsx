// components/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as SplashScreen from "expo-splash-screen";

const { width } = Dimensions.get("window");

export default function SplashScreenComponent({ onFinish }: { onFinish(): void }) {
  const player = useVideoPlayer(require("../assets/images/Vira.mp4"));

  // 1️⃣ Start playback as soon as the player instance is available
  useEffect(() => {
    // set looping off if you like
    player.loop = false;
    // start playback
    player.play();
  }, [player]);

  // your existing splash‐hiding logic…
  useEffect(() => {
    let fallback = setTimeout(async () => {
      await SplashScreen.hideAsync();
      onFinish();
    }, 7000);
    SplashScreen.preventAutoHideAsync().catch(() => {});
    return () => clearTimeout(fallback);
  }, [onFinish]);

  useEffect(() => {
    const sub = player.addListener("playToEnd", async () => {
      await SplashScreen.hideAsync();
      onFinish();
    });
    return () => sub.remove();
  }, [player, onFinish]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Match your app's background color
  },
  video: {
    width: width,
    height: width
  },
});