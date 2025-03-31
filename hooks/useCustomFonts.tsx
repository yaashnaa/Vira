// hooks/useCustomLocalFonts.ts
import { useFonts } from "expo-font";

export default function useCustomLocalFonts() {
  const [fontsLoaded] = useFonts({
    // The keys here are the names you’ll reference in your styles.
    "Title-font-regular": require("../assets/fonts/Charm-Regular.ttf"),
    "Title-font-Bold": require("../assets/fonts/Charm-Bold.ttf"),
    "Space-Mono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Serif-font": require("../assets/fonts/MarkaziText-VariableFont_wght.ttf"),
    "Main-font": require("../assets/fonts/GowunDodum-Regular.ttf"),

  });

  return fontsLoaded;
}
