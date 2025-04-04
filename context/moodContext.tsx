// context/MoodContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth"; // ✅ Keep this
import AsyncStorage from "@react-native-async-storage/async-storage";

import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getMoodHistory, logMoodLocally } from "../utils/asyncStorage";
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
  });
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
        // 🔁 fallback to local storage
        const moods = await getMoodHistory(userId);

        if (moods[dateStr] !== undefined) {
          setMood(moods[dateStr]);
          setLastLoggedDate(dateStr);
          console.log(
            `Fetched today's mood from AsyncStorage: ${moods[dateStr]}`
          );
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
      const docRef = doc(db, "users", userId, "moods", dateStr);

      await setDoc(docRef, { mood: value, date: dateStr });

      // 🔁 Save to local storage
      await logMoodLocally(userId, value);

      setMood(value);
      setLastLoggedDate(dateStr);
      console.log(
        `Mood logged successfully for user ${userId} on ${dateStr}: ${value}`
      );
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

      // 🔁 fallback: try from AsyncStorage if nothing in Firestore
      if (moodEntries.length === 0) {
        const localMoods = await getMoodHistory(userId);
        return Object.entries(localMoods).map(([date, mood]) => ({
          date,
          mood,
        }));
      }

      return moodEntries;
    } catch (error) {
      console.error("Error fetching all moods:", error);
      // fallback: always try local
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
