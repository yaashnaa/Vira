// context/checkInContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import dayjs from "dayjs";

interface CheckInContextType {
  moodLabel: string | null;
  energyLabel: string | null;
  sleepLabel: string | null;
  hasCheckedInToday: boolean;
  refreshCheckIn: () => Promise<void>;
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export const CheckInProvider = ({ children }: { children: React.ReactNode }) => {
  const [moodLabel, setMoodLabel] = useState<string | null>(null);
  const [energyLabel, setEnergyLabel] = useState<string | null>(null);
  const [sleepLabel, setSleepLabel] = useState<string | null>(null);
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
    } else {
      setMoodLabel(null);
      setEnergyLabel(null);
      setSleepLabel(null);
      setLastCheckInDate(null);
    }
  };

  useEffect(() => {
    refreshCheckIn();
  }, []);

  const value: CheckInContextType = {
    moodLabel,
    energyLabel,
    sleepLabel,
    hasCheckedInToday,
    refreshCheckIn,
  };

  return (
    <CheckInContext.Provider value={value}>
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckInContext = () => {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error("useCheckInContext must be used within a CheckInProvider");
  }
  return context;
};
