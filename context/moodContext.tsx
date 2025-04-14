import React, { createContext, useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { saveMoodLog } from "@/utils/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MoodContextType {
  userId: string | null;
  mood: number | null;
  lastLoggedDate: string | null;
  hasLoggedToday: boolean;
  logMood: (value: number) => Promise<void>;
  fetchTodaysMood: () => Promise<void>;
  fetchAllMoods: () => Promise<{ date: string; mood: number }[]>;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [lastLoggedDate, setLastLoggedDate] = useState<string | null>(null);

  const today = dayjs().format("YYYY-MM-DD");
  const hasLoggedToday = lastLoggedDate === today;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setMood(null);
        setLastLoggedDate(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTodaysMood();
    }
  }, [userId]);

  const fetchTodaysMood = async () => {
    if (!userId) return;
    const dateStr = today;
    try {
      const docRef = doc(db, "users", userId, "moods", dateStr);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setMood(data.mood);
        setLastLoggedDate(data.date);
        console.log(`Fetched today's mood from Firestore: ${data.mood}`);
      } else {
        const localMoods = await getMoodHistory(userId);
        if (localMoods[dateStr] !== undefined) {
          setMood(localMoods[dateStr]);
          setLastLoggedDate(dateStr);
          console.log(`Fetched today's mood from AsyncStorage: ${localMoods[dateStr]}`);
        } else {
          setMood(null);
          setLastLoggedDate(null);
          console.log("No mood logged for today yet.");
        }
      }
    } catch (error) {
      console.error("Error fetching today's mood:", error);
    }
  };

  const logMood = async (value: number) => {
    if (!userId) return;
    const dateStr = today;
    console.log(`Attempting to log mood ${value} for date ${dateStr}`);
    try {
      await saveMoodLog(userId, value.toString());
      await logMoodLocally(userId, value);

      setMood(value);
      setLastLoggedDate(dateStr);
      console.log(`Mood logged successfully for user ${userId} on ${dateStr}: ${value}`);
    } catch (error) {
      console.error("Error logging mood:", error);
    }
  };

  const fetchAllMoods = async () => {
    if (!userId) return [];
    try {
      const collectionRef = collection(db, "users", userId, "moods");
      const snapshot = await getDocs(collectionRef);
      const moodEntries: { date: string; mood: number }[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.date && data.mood !== undefined) {
          moodEntries.push({ date: data.date, mood: data.mood });
        }
      });

      if (moodEntries.length === 0) {
        const localMoods = await getMoodHistory(userId);
        return Object.entries(localMoods).map(([date, mood]) => ({ date, mood }));
      }

      return moodEntries;
    } catch (error) {
      console.error("Error fetching all moods:", error);
      const localMoods = await getMoodHistory(userId);
      return Object.entries(localMoods).map(([date, mood]) => ({ date, mood }));
    }
  };

  const value: MoodContextType = {
    userId,
    mood,
    lastLoggedDate,
    hasLoggedToday,
    logMood,
    fetchTodaysMood,
    fetchAllMoods,
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

// helper functions (if needed)
async function logMoodLocally(userId: string, mood: number) {
  const key = `@moodHistory_${userId}`;
  const stored = await AsyncStorage.getItem(key);
  const history = stored ? JSON.parse(stored) : {};
  const today = dayjs().format("YYYY-MM-DD");
  history[today] = mood;
  await AsyncStorage.setItem(key, JSON.stringify(history));
}

async function getMoodHistory(userId: string): Promise<Record<string, number>> {
  const key = `@moodHistory_${userId}`;
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}
