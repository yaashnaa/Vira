// utils/localStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserScopedKey = (uid: string, key: string) => `@${key}_${uid}`;
const ONBOARDING_KEY = "@onboardingComplete";
export const markOnboardingComplete = async () => {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === "true";
};
export const checkOnboardingState = async () => {
  const value = await AsyncStorage.getItem("@onboardingComplete");
  console.log("📦 Onboarding complete?", value === "true");
};

export const markQuizComplete = async (uid: string) => {
  await AsyncStorage.setItem(getUserScopedKey(uid, "quizComplete"), "true");
};

export const isQuizComplete = async (uid: string): Promise<boolean> => {
  const value = await AsyncStorage.getItem(
    getUserScopedKey(uid, "quizComplete")
  );
  return value === "true";
};

export const markScreeningQuizComplete = async (uid: string) => {
  await AsyncStorage.setItem(
    getUserScopedKey(uid, "screeningQuizComplete"),
    "true"
  );
};

export const isScreeningQuizComplete = async (
  uid: string
): Promise<boolean> => {
  const value = await AsyncStorage.getItem(
    getUserScopedKey(uid, "screeningQuizComplete")
  );
  return value === "true";
};

// Optional: Scoped reset (clear all keys for a specific user only)
export const resetAsyncStorageForUser = async (uid: string) => {
  await AsyncStorage.multiRemove([
    getUserScopedKey(uid, "onboardingComplete"),
    getUserScopedKey(uid, "quizComplete"),
    getUserScopedKey(uid, "screeningQuizComplete"),
  ]);
  console.log(`AsyncStorage cleared for UID: ${uid}`);
};

// Full reset — clears all AsyncStorage data (for development)
export const resetAllAsyncStorage = async () => {
  await AsyncStorage.clear();
  console.log("All AsyncStorage cleared");
};
