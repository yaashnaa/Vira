import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import {
  isOnboardingComplete,
  markOnboardingComplete,
} from "@/utils/asyncStorage";

const welcome = require("../../assets/animations/7.json");
const mindfulTracking = require("../../assets/animations/4.json");
const selfCompassion = require("../../assets/animations/9.json");
const holisticWellBeing = require("../../assets/animations/3.json");
const getStarted = require("../../assets/animations/getstarted.json");

const { width } = Dimensions.get("window");

export default function OnBoardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingComplete = await isOnboardingComplete();
        // console.log("📦 Onboarding complete?", onboardingComplete);

        if (onboardingComplete) {
          router.replace("/(auth)/welcome");
        } else {
          setShouldShowOnboarding(true);
        }
      } catch (error) {
        console.error("❌ Error checking onboarding status:", error);
        setShouldShowOnboarding(true);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleFinishOnboarding = async () => {
    try {
      await markOnboardingComplete();
      // console.log("✅ Onboarding marked complete");
      router.replace("/(auth)/signup");
    } catch (error) {
      console.error("❌ Error saving onboarding status:", error);
    }
  };

  if (loading) {
    return null
  }

  if (shouldShowOnboarding) {
    return (
      <View style={styles.container}>
        <Onboarding
          onDone={handleFinishOnboarding}
          onSkip={handleFinishOnboarding}
          titleStyles={{
            fontFamily: "PatrickHand-Regular",
            fontSize: 29,
            color: "#361d05",
          }}
          subTitleStyles={{
            fontFamily: "Main-font",
            fontSize: 16,
            color: "#333",
          }}
          pages={[
            {
              backgroundColor: "#e8c3f1",
              image: (
                <LottieView
                  source={welcome}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Welcome to Your Wellness Companion",
              subtitle:
                "This is a space to nurture your mental, physical, and emotional well-being—gently and intentionally.",
            },
            {
              backgroundColor: "#b5758cbc",
              image: (
                <LottieView
                  source={mindfulTracking}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Feel First, Track Second",
              subtitle:
                "We guide you to tune into your emotions and energy, instead of obsessing over numbers or calories.",
            },
            {
              backgroundColor: "#b5d6d8",
              image: (
                <LottieView
                  source={selfCompassion}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Compassion Over Perfection",
              subtitle:
                "No pressure. No judgment. Just small steps and honest check-ins toward a healthier you.",
            },
            {
              backgroundColor: "#f9eba7a1",
              image: (
                <LottieView
                  source={holisticWellBeing}
                  autoPlay
                  loop
                  style={[{ width: width * 1.0, height: width }, styles.lottie]}
                />
              ),
              title: "Whole-Self Wellness",
              subtitle:
                "Your mind, body, habits, and feelings are all connected. Let’s explore how they support each other.",
            },
            {
              backgroundColor: "#e1cfff",
              image: (
                <LottieView
                  source={getStarted}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              ),
              title: "Let’s Begin, Gently",
              subtitle:
                "We're here to support you in building habits that feel good, not forced. Ready to start your journey?",
            },
          ]}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lottie: {
    width: width,
    height: width - 10,
  },
});
