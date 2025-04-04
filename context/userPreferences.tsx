import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { saveUserPreferences } from "../utils/firestore";

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
}

const UserPreferencesContext = createContext<UserPreferencesContextProps | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    name: '',
    ageGroup: '',
    activityLevel: '',
    dietaryPreferences: [],
    mealLogging: '',
    physicalHealth: '',
    mentalHealthOptIn: false,
    remindersFrequency: 'Standard',
    hideMealTracking: false, 
    mentalHealthConditions: [],
    medicalConditions: [],
    calorieViewing: false,
    macroViewing: false, 
    foodAnxiety: '',
    primaryGoals: [],
    moodCheckIn: false,
    mentalHealthSupport: '',
    triggerWarnings: '',
    approach: '',
    customGoals: [],
    customMedicalConditions: '',
    customMentalHealthConditions: '',
    customDietaryPreferences: [],
  });

  // Save preferences when they change and a user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Save the preferences for the authenticated user
        saveUserPreferences(user.uid, userPreferences);
      }
    });

    return unsubscribe;
  }, [userPreferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  return (
    <UserPreferencesContext.Provider value={{ userPreferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
