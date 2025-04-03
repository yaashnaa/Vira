import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth } from "../config/firebaseConfig";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged, // ✅ Add this line
  getAuth,
} from "firebase/auth";
import { migrateNameToPreferences } from "@/utils/migrateNameToPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveUserPreferences } from "../utils/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { loadPreferencesLocally, storePreferencesLocally } from "../utils/asyncStorage";

export interface UserPreferences {
  name: string;
  ageGroup: string;
  activityLevel: string;
  dietaryPreferences: string[];
  mealLogging: string;
  physicalHealth: string;
  mentalHealthOptIn: boolean;
  remindersFrequency: string;
  hideMealTracking: boolean;
  mentalHealthConditions: string[];
  medicalConditions: string[];
  calorieViewing: boolean;
  macroViewing: boolean;
  foodAnxiety: string;
  primaryGoals: string[];
  moodCheckIn: boolean;
  mentalHealthSupport: string;
  triggerWarnings: string;
  approach: string;
  customGoals: string[];
  customMedicalConditions: string;
  customMentalHealthConditions: string;
  customDietaryPreferences: string[];
}

interface UserPreferencesContextProps {
  userPreferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
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
  const loadUserPreferences = async (
    userId: string
  ): Promise<UserPreferences | null> => {
    try {
      const docRef = doc(db, "users", userId, "preferences", "main"); // ✅ correct path


      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        console.log("Fetched user preferences from Firestore:", snapshot.data());
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

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: "",
    ageGroup: "",
    activityLevel: "",
    dietaryPreferences: [],
    mealLogging: "",
    physicalHealth: "",
    mentalHealthOptIn: false,
    remindersFrequency: "Standard",
    hideMealTracking: false,
    mentalHealthConditions: [],
    medicalConditions: [],
    calorieViewing: false,
    macroViewing: false,
    foodAnxiety: "",
    primaryGoals: [],
    moodCheckIn: false,
    mentalHealthSupport: "",
    triggerWarnings: "",
    approach: "",
    customGoals: [],
    customMedicalConditions: "",
    customMentalHealthConditions: "",
    customDietaryPreferences: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await migrateNameToPreferences(user.uid);
        const prefs = await loadUserPreferences(user.uid);
        if (prefs) {
          setUserPreferences(prefs);
          console.log("Loaded user preferences from Firestore:", prefs);
        } else {
          console.log("No saved preferences found. Using defaults.");
        }
      }
      setLoading(false); // ✅ done loading
    });
  
    return unsubscribe;
  }, []);
  

  useEffect(() => {
    if (userId && hasLoaded) {
      console.log("Saving preferences for", userId);
      saveUserPreferences(userId, userPreferences);
    }
  }, [userId, hasLoaded, userPreferences]);
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences((prev) => {
      const updated = { ...prev, ...newPreferences };
      if (userId) {
        storePreferencesLocally(userId, updated); // ✅ save locally
      }
      return updated;
    });
  };
  

  return (
    <UserPreferencesContext.Provider value={{ userPreferences, updatePreferences, loading }}>

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


