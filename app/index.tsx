import { useState } from "react";
import SplashScreenComponent from "../components/SplashScreen";
import { Redirect } from "expo-router";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreenComponent onFinish={() => setShowSplash(false)} />;
  }

  return <Redirect href="/OnBoarding" />;
}
