import React, { createContext, useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, Timestamp } from "firebase/firestore";
interface MoodContextType {
  userId: string | null;
  mood: number | null;
  lastLoggedDate: string | null;
  hasLoggedToday: boolean;
  logMood: (value: number) => Promise<void>;
  fetchTodaysMood: () => Promise<void>;
  fetchAllMoods: () => Promise<{ date: string; mood: number }[]>;
  fetchAllCheckIns: () => Promise<
    { date: string; mood: number; energy: string; sleep: string }[]
  >;
  refreshMoodContext: () => Promise<void>; // <<< ADD THIS
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [mood, setMood] = useState<number | null>(null);
  const [lastLoggedDate, setLastLoggedDate] = useState<string | null>(null);

  const today = dayjs().format("YYYY-MM-DD");
  const hasLoggedToday = lastLoggedDate === today;
  const refreshMoodContext = async () => {
    await fetchTodaysMood();
  };
  
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

  const moodScale = {
    "Feeling Great": 0,
    "Pretty Good": 25,
    "Hanging in There": 50,
    "Not My Best": 75,
    "Having a Tough Day": 100,
  };
  const fetchAllCheckIns = async () => {
    if (!userId) return [];

    try {
      const snapshot = await getDocs(
        collection(db, "users", userId, "checkins")
      );
      const checkIns: {
        date: string;
        mood: number;
        sleep: string;
        energy: string;
      }[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.timestamp && data.mood && data.sleep && data.energy) {
          const date = dayjs(data.timestamp.toDate()).format("YYYY-MM-DD");
          checkIns.push({
            date,
            mood: getMoodValue(data.mood),
            sleep: data.sleep,
            energy: data.energy,
          });
        }
      });

      return checkIns;
    } catch (error) {
      console.error("Error fetching all check-ins:", error);
      return [];
    }
  };

  const fetchTodaysMood = async () => {
    if (!userId) return;
    try {
      const q = query(
        collection(db, "users", userId, "checkins"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const docDate = dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD");

        if (
          docDate === today &&
          data.mood &&
          moodScale[data.mood as keyof typeof moodScale]
        ) {
          const moodValue = moodScale[data.mood as keyof typeof moodScale];
          setMood(moodValue);
          setLastLoggedDate(docDate);
          return;
        }
      }

      setMood(null);
      setLastLoggedDate(null);
    } catch (err) {
      console.error("Error fetching today's mood from checkins:", err);
    }
  };

  const logMood = async (value: number) => {
    if (!userId) return;
    const dateStr = today;

    try {
      // Save to Firestore checkins subcollection
      await addDoc(collection(db, "users", userId, "checkins"), {
        mood: getMoodLabel(value),
        timestamp: Timestamp.now(),
      });

      setMood(value);
      setLastLoggedDate(dateStr);
      console.log(`✅ Mood ${value} logged to checkins on ${dateStr}`);
    } catch (error) {
      console.error("❌ Error logging mood to checkins:", error);
    }
  };
  const fetchAllMoods = async () => {
    if (!userId) return [];

    try {
      const collectionRef = collection(db, "users", userId, "checkins");
      const snapshot = await getDocs(collectionRef);
      const moodEntries: { date: string; mood: number }[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.timestamp && data.mood) {
          const date = dayjs(data.timestamp.toDate()).format("YYYY-MM-DD");
          const moodValue = getMoodValue(data.mood); // convert label back to a number
          moodEntries.push({ date, mood: moodValue });
        }
      });

      return moodEntries;
    } catch (error) {
      console.error("❌ Error fetching moods from checkins:", error);
      return [];
    }
  };
  function getMoodValue(label: string): number {
    switch (label) {
      case "Feeling Great":
        return 0;
      case "Pretty Good":
        return 25;
      case "Hanging in There":
        return 50;
      case "Not My Best":
        return 75;
      case "Having a Tough Day":
        return 100;
      default:
        return 50; // fallback to neutral
    }
  }

  const value: MoodContextType = {
    userId,
    mood,
    lastLoggedDate,
    hasLoggedToday,
    logMood,
    fetchTodaysMood,
    fetchAllMoods,
    fetchAllCheckIns,
    refreshMoodContext, // <<< ADD THIS
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

function getMoodLabel(value: number): string {
  switch (value) {
    case 0:
      return "Feeling Great";
    case 25:
      return "Pretty Good";
    case 50:
      return "Hanging in There";
    case 75:
      return "Not My Best";
    case 100:
      return "Having a Tough Day";
    default:
      return "Hanging in There"; // fallback
  }
}
