// hooks/useCustomLocalFonts.ts
import { useFonts } from "expo-font";

export default function useCustomLocalFonts() {
  const [fontsLoaded] = useFonts({
    // Your existing fonts
    "Title-font-regular": require("../assets/fonts/Charm-Regular.ttf"),
    "Title-font-Bold": require("../assets/fonts/Charm-Bold.ttf"),
    "Space-Mono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Serif-font": require("../assets/fonts/MarkaziText-VariableFont_wght.ttf"),
    "Main-font": require("../assets/fonts/GowunDodum-Regular.ttf"),

    // 🌿 Calming cursive & handwritten fonts
    "Kalam-Regular": require("../assets/fonts/Kalam-Regular.ttf"),
    "Kalam-Bolc": require("../assets/fonts/Kalam-Bold.ttf"),
    "Kalam-Light": require("../assets/fonts/Kalam-Light.ttf"),
    "Sacramento-Regular": require("../assets/fonts/Sacramento-Regular.ttf"),
    "Cookie-Regular": require("../assets/fonts/Cookie-Regular.ttf"),
    "PatrickHand-Regular": require("../assets/fonts/PatrickHand-Regular.ttf"),

    // 🧁 Rounded sans-serif fonts
    "Quicksand-Regular": require("../assets/fonts/Quicksand-VariableFont_wght.ttf"),
    "Nunito-Regular": require("../assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf"),
    "Nunito-Regular-Italic": require("../assets/fonts/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf"),
    "Comfortaa-Regular": require("../assets/fonts/Comfortaa-VariableFont_wght.ttf"),

  });

  return fontsLoaded;
}
