import React, { useEffect } from "react";
import { View, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreenComponent({ onFinish }: SplashScreenProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem(
          "@onboardingComplete"
        );
        if (onboardingComplete) {
          // User has completed onboarding, navigate to home screen.
          router.replace("/home");
        } else {
          // No onboarding flag; navigate to onboarding screen.
          router.replace("/(auth)/OnBoarding");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Fallback: navigate to onboarding if error occurs.
        router.replace("/(auth)/OnBoarding");
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  useEffect(() => {
    const hideSplash = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 sec
      await SplashScreen.hideAsync();
      onFinish(); // Calls function to transition to onboarding
    };
    hideSplash();
  }, []);
  if (loading) {
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
  return null;
}
