import AsyncStorage from "@react-native-async-storage/async-storage";

export const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem("@onboardingComplete");
    console.log("Onboarding flag removed. Onboarding will be shown next launch.");
  } catch (error) {
    console.error("Error resetting onboarding:", error);
  }
};
