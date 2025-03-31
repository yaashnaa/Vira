import { useState, useEffect } from "react";
import SplashScreenComponent from "../components/SplashScreen";
import { useRouter } from "expo-router";
import useCustomLocalFonts from "@/hooks/useCustomFonts";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const fontsLoaded = useCustomLocalFonts();

  useEffect(() => {
    if (!showSplash) {
      // Navigate only after the component has mounted
      router.replace("/OnBoarding");
    }
  }, [showSplash, router]);

  if (showSplash && fontsLoaded) {
    return <SplashScreenComponent onFinish={() => setShowSplash(false)} />;
  }

  return null;
}
