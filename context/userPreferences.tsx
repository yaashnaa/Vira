import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { migrateNameToPreferences } from "@/utils/migrateNameToPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveUserPreferences } from "../utils/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export interface UserPreferences {
  name: string;
  ageGroup: string;
  activityLevel: string;
  dietaryPreferences: string[];
  customDietaryPreferences: string[];
  mealLogging: string;
  hideMealTracking: boolean;
  physicalHealth: string;
  mentalHealthConditions: string[];
  medicalConditions: string[];
  customMedicalConditions: string;
  customMentalHealthConditions: string;
  calorieViewing: boolean;
  macroViewing: boolean;
  caloriePreference: string;
  macroPreference: string;
  foodAnxiety: boolean;
  anxiousFood: string;
  foodAnxietyLevel: string;
  primaryGoals: string[];
  moodCheckIn: string;
  moodcCheckInBool: boolean;
  mentalHealthSupport: string;
  triggerWarnings: string;
  remindersFrequency: string;
  approach: string;
  mentalHealthOptIn: boolean;
  movementRelationship: string;
  tonePreference: string;
  contentAvoidance: string;
  copingToolsConsent: string;
  userNotes: string;
}

export const DEFAULT_PREFS: UserPreferences = {
  name: "",
  ageGroup: "18–25", // ← ✅ your desired default
  activityLevel: "Moderately active (3–5 days/week)",
  dietaryPreferences: ["Vegetarian"],
  customDietaryPreferences: [],
  mealLogging: "Yes, I’m okay with logging (including approximate calories or macros).",
  hideMealTracking: false,
  physicalHealth: "Average",
  mentalHealthConditions: [],
  medicalConditions: [],
  customMedicalConditions: "",
  customMentalHealthConditions: "",
  calorieViewing: true,
  macroViewing: true,
  caloriePreference: "Yes, I’d like to see calories.",
  macroPreference: "Yes, I’d like to see macros.",
  foodAnxiety: false,
  anxiousFood: "No, I don't feel anxious",
  foodAnxietyLevel: "None",
  primaryGoals: ["Build consistency"],
  moodCheckIn: "Yes, definitely.",
  moodcCheckInBool: true,
  mentalHealthSupport: "Yes, please show me available resources.",
  triggerWarnings: "I’m okay with seeing all data.",
  remindersFrequency: "Standard (2–3 times per day)",
  approach: "Slow and steady",
  mentalHealthOptIn: true,
  movementRelationship: "Joyful & energizing",
  tonePreference: "Gentle & supportive",
  contentAvoidance: "None",
  copingToolsConsent: "Yes, always",
  userNotes: "",
};

interface UserPreferencesContextProps {
  userPreferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  updatePreferencesFromFirestore: () => Promise<void>;
  loading: boolean;
}

const UserPreferencesContext = createContext<
  UserPreferencesContextProps | undefined
>(undefined);

export const UserPreferencesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // context/userPreferences.tsx

  const updatePreferencesFromFirestore = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const docRef = doc(db, "users", uid, "preferences", "main");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserPreferences({ ...DEFAULT_PREFS, ...(data as UserPreferences) });
        console.log("🔄 User preferences updated from Firestore");
      } else {
        console.warn("⚠️ Preferences document does not exist for user:", uid);
      }
    } catch (error) {
      console.error("🔥 Error fetching preferences from Firestore:", error);
    }
  };

  const loadUserPreferences = async (
    userId: string
  ): Promise<UserPreferences | null> => {
    try {
      const docRef = doc(db, "users", userId, "preferences", "main"); // ✅ correct path

      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        console.log(
          "Fetched user preferences from Firestore:",
          snapshot.data()
        );
        return snapshot.data() as UserPreferences;
      }
      return null;
    } catch (error) {
      console.error("Error loading user preferences:", error);
      return null;
    }
  };

  const [userId, setUserId] = useState<string | null>(null);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userPreferences, setUserPreferences] =
    useState<UserPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await migrateNameToPreferences(user.uid);
        const prefs = await loadUserPreferences(user.uid);
        if (prefs) {
          setUserPreferences({ ...DEFAULT_PREFS, ...prefs });
          setHasLoaded(true);
          console.log("Loaded user preferences from Firestore:", prefs);
        } else {
          setHasLoaded(true);
          console.log("No saved preferences found. Using defaults.");
        }
      }
      setLoading(false); // ✅ done loading
    });

    return unsubscribe;
  }, []);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences((prev) => {
      const updated = { ...prev, ...newPreferences };

      if (userId) {
        saveUserPreferences(userId, updated); // ✅ only save the merged version
      }

      return updated;
    });
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        userPreferences,
        updatePreferences,
        loading,
        updatePreferencesFromFirestore,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
};
