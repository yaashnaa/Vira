import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreenComponent from "../components/SplashScreen";
import useCustomLocalFonts from "@/hooks/useCustomFonts";
import "react-native-get-random-values";
import 'react-native-reanimated';

export default function Index() {
  const router = useRouter();
  const fontsLoaded = useCustomLocalFonts();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash && fontsLoaded) {
      const checkAndRoute = async () => {
        try {
          const loggedIn = await AsyncStorage.getItem("@loggedIn");
          if (loggedIn === "true") {
            router.replace("/dashboard");
          } else {
            router.replace("/OnBoarding");
          }
        } catch (e) {
          console.error("Storage error", e);
          router.replace("/OnBoarding");
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