import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreenComponent from "../components/SplashScreen";
import useCustomLocalFonts from "@/hooks/useCustomFonts";

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useCustomLocalFonts();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash && fontsLoaded) {
      const checkAndRoute = async () => {
        const onboardingComplete = await AsyncStorage.getItem("@onboardingComplete");
        const loggedIn = await AsyncStorage.getItem("@loggedIn");

        if (!onboardingComplete) {
          router.replace("/OnBoarding");
        } else if (loggedIn === "true") {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      };

      checkAndRoute();
    }
  }, [showSplash, fontsLoaded]);

  if (showSplash && fontsLoaded) {
    return <SplashScreenComponent onFinish={() => setShowSplash(false)} />;
  }

  return null;
}
