// context/MoodContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs"; // optional for date formatting

interface DailyMoods {
  [date: string]: number; // store mood as a number; can be string if you prefer
}

interface MoodContextType {
  dailyMoods: DailyMoods;
  hasLoggedToday: boolean;
  logMood: (value: number) => Promise<void>;
  loadDailyMoods: () => Promise<void>;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

const STORAGE_KEY = "@my_mood_logs";

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [dailyMoods, setDailyMoods] = useState<DailyMoods>({});
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");

  // Load from AsyncStorage on mount
  useEffect(() => {
    loadDailyMoods();
  }, []);

  // Each time dailyMoods changes, check if we have an entry for today
  useEffect(() => {
    setHasLoggedToday(Boolean(dailyMoods[today]));
  }, [dailyMoods, today]);

  // Load daily moods from AsyncStorage
  const loadDailyMoods = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) {
        const parsed = JSON.parse(jsonValue) as DailyMoods;
        setDailyMoods(parsed);
      } else {
        // no mood logs stored yet
        setDailyMoods({});
      }
    } catch (error) {
      console.error("Error loading daily moods:", error);
    }
  };

  // Save daily moods to AsyncStorage
  const saveDailyMoods = async (updated: DailyMoods) => {
    try {
      const jsonValue = JSON.stringify(updated);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving daily moods:", error);
    }
  };

  // Log a mood for today
  const logMood = async (value: number) => {
    const updated = { ...dailyMoods, [today]: value };
    setDailyMoods(updated);
    await saveDailyMoods(updated);
    // hasLoggedToday will be updated by the effect
  };

  const value = {
    dailyMoods,
    hasLoggedToday,
    logMood,
    loadDailyMoods,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMoodContext() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMoodContext must be used within a MoodProvider");
  }
  return context;
}
