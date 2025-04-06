import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreenComponent from "../components/SplashScreen";
import useCustomLocalFonts from "@/hooks/useCustomFonts";
import { Provider } from "react-native-paper";
import "react-native-get-random-values";

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useCustomLocalFonts();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash && fontsLoaded) {
      const checkAndRoute = async () => {
        const loggedIn = await AsyncStorage.getItem("@loggedIn");
  
        console.log("🔐 Logged in?", loggedIn);
  
        if (loggedIn === "true") {
          router.replace("/dashboard");
        } else {
          router.replace("/OnBoarding"); // always go to onboarding and let it decide what to show
        }
      };
  
      checkAndRoute();
    }
  }, [showSplash, fontsLoaded]);
  
  

  if (showSplash && fontsLoaded) {
    return (
      <>
        <SplashScreenComponent onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return null;
}
