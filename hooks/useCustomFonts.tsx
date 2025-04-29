// hooks/useCustomLocalFonts.ts
import { useFonts } from "expo-font";

export default function useCustomLocalFonts() {
  const [fontsLoaded] = useFonts({
    "Space-Mono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Main-font": require("../assets/fonts/GowunDodum-Regular.ttf"),
    "PatrickHand-Regular": require("../assets/fonts/PatrickHand-Regular.ttf"),
  });

  return fontsLoaded;
}
