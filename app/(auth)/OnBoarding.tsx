import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const welcome = require("../../assets/animations/welcome1.json");
const mindfulTracking = require("../../assets/animations/1.json");
const selfCompassion = require("../../assets/animations/compassion.json");
const holisticWellBeing = require("../../assets/animations/holistic.json");
const getStarted = require("../../assets/animations/getstarted.json");

const { width } = Dimensions.get("window");

export default function OnBoardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // This flag indicates whether to show the onboarding screen.
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  const checkOnboardingAndAuth = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem("@onboardingComplete");
      if (onboardingComplete) {
        // If onboarding is complete, navigate to home.
        router.replace("/signup");
      } else {
        // Otherwise, set the flag to show onboarding.
        setShouldShowOnboarding(true);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setShouldShowOnboarding(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingAndAuth();
  }, [router]);

  const handleFinishOnboarding = async () => {
    try {
      // Save flag so onboarding isn't shown again.
      await AsyncStorage.setItem("@onboardingComplete", "true");
      router.replace("/home");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  // While loading, you might show a splash image
  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/vira.gif")}
          style={{ width: 500, height: 500 }}
        />
      </View>
    );
  }

  // If onboarding hasn't been completed, show the onboarding swiper.
  if (shouldShowOnboarding) {
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

  // If loading is false and onboarding is not to be shown (meaning onboarding is complete), nothing renders here
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lottie: {
    width: width * 0.9,
    height: width - 60,
  },
});
