// src/context/checkInContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { collection, getDocs, query, orderBy, limit, addDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

interface CheckInContextType {
  moodLabel: string | null;
  energyLabel: string | null;
  sleepLabel: string | null;
  hasCheckedInToday: boolean;
  moodNumeric: number | null;
  logMood: (value: number) => Promise<void>;
  fetchAllMoods: () => Promise<{ date: string; mood: number }[]>;
  fetchAllCheckIns: () => Promise<{ date: string; mood: number; energy: string; sleep: string }[]>;
  refreshCheckIn: () => Promise<void>;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export const CheckInProvider = ({ children }: { children: React.ReactNode }) => {
  const [moodLabel, setMoodLabel] = useState<string | null>(null);
  const [energyLabel, setEnergyLabel] = useState<string | null>(null);
  const [sleepLabel, setSleepLabel] = useState<string | null>(null);
  const [moodNumeric, setMoodNumeric] = useState<number | null>(null);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);

  const today = dayjs().format("YYYY-MM-DD");
  const hasCheckedInToday = lastCheckInDate === today;

  const refreshCheckIn = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "users", uid, "checkins"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      if (data.timestamp) {
        const docDate = dayjs(data.timestamp.toDate()).format("YYYY-MM-DD");
        setLastCheckInDate(docDate);
      }
      setMoodLabel(data.mood || null);
      setEnergyLabel(data.energy || null);
      setSleepLabel(data.sleep || null);
      setMoodNumeric(getMoodValue(data.mood));
    } else {
      setMoodLabel(null);
      setEnergyLabel(null);
      setSleepLabel(null);
      setMoodNumeric(null);
      setLastCheckInDate(null);
    }
  };

  useEffect(() => {
    refreshCheckIn();
  }, []);

  const fetchAllMoods = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];

    try {
      const snapshot = await getDocs(
        collection(db, "users", uid, "checkins")
      );
      const moods: { date: string; mood: number }[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.timestamp && data.mood) {
          const date = dayjs(data.timestamp.toDate()).format("YYYY-MM-DD");
          moods.push({ date, mood: getMoodValue(data.mood) });
        }
      });
      return moods;
    } catch (error) {
      console.error("Error fetching moods:", error);
      return [];
    }
  };

  const fetchAllCheckIns = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];

    try {
      const snapshot = await getDocs(
        collection(db, "users", uid, "checkins")
      );
      const checkIns: { date: string; mood: number; sleep: string; energy: string }[] = [];
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
      console.error("Error fetching check-ins:", error);
      return [];
    }
  };

  const logMood = async (value: number) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await addDoc(collection(db, "users", uid, "checkins"), {
        mood: getMoodLabel(value),
        timestamp: Timestamp.now(),
      });
      await refreshCheckIn(); // refresh context after posting
    } catch (error) {
      console.error("Error logging mood:", error);
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
        return 50;
    }
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
        return "Hanging in There";
    }
  }

  const value: CheckInContextType = {
    moodLabel,
    energyLabel,
    sleepLabel,
    hasCheckedInToday,
    moodNumeric,
    logMood,
    fetchAllMoods,
    fetchAllCheckIns,
    refreshCheckIn,
  };

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
};

export const useCheckInContext = () => {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error("useCheckInContext must be used within a CheckInProvider");
  }
  return context;
};
