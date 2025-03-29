import React from "react";
import { View, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const welcome = require("../../assets/animations/welcome1.json");
const mindfulTracking = require("../../assets/animations/1.json");
const selfCompassion = require("../../assets/animations/compassion.json");
const holisticWellBeing = require("../../assets/animations/holistic.json"); // New animation for holistic wellness
const getStarted = require("../../assets/animations/getstarted.json"); // New animation for getting started

const { width, height } = Dimensions.get("window");
export default function OnBoardingScreen() {
  const router = useRouter();
  const handleFinishOnboarding = async () => {
    try {
      // Save flag so onboarding isn't shown again.
      await AsyncStorage.setItem('@onboardingComplete', 'true');
      router.replace('/home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <View style={styles.container}>
        <Onboarding
          onDone={handleFinishOnboarding}
          onSkip={() => router.replace("/welcome")}
          pages={[
            {
              backgroundColor: "#b6dde9",
              image: (
                <LottieView
                  source={welcome}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Welcome to Your Wellness Journey",
              subtitle:
                "A mindful approach to fitness, nutrition, and mental health.",
            },
            {
              backgroundColor: "#E7D2CF",
              image: (
                <LottieView
                  source={mindfulTracking}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Mindful Tracking, Not Numbers",
              subtitle:
                "We focus on how you feel, not just what you do. No calorie counting, just mindful self-reflection.",
            },
            {
              backgroundColor: "#adb5d3",
              image: (
                <LottieView
                  source={selfCompassion}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Self-Compassionate Guidance",
              subtitle:
                "Your journey is unique. No pressure, just support for lasting healthy habits.",
            },
            {
              backgroundColor: "#c1dfd6",
              image: (
                <LottieView
                  source={holisticWellBeing}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Holistic Well-Being",
              subtitle:
                "Wellness isn’t just about fitness—it’s about your mind, body, and emotions working together.",
            },
            {
              backgroundColor: "#d1c4e9",
              image: (
                <LottieView
                  source={getStarted}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Let's Begin!",
              subtitle:
                "Take small steps towards a healthier you. Start your journey today!",
            },
          ]}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  lottie: {
    width: width * 0.9,
    height: width -60,
  },
});
