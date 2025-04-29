// src/hooks/useCheckInData.ts
import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import dayjs from "dayjs";

export function useCheckInData(refreshTrigger: number) {
  const [checkIn, setCheckIn] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchCheckIn = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const today = dayjs().format("YYYY-MM-DD");
        const q = query(
          collection(db, "users", uid, "checkins"),
          where("date", "==", today),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCheckIn(snapshot.docs[0].data());
        } else {
          setCheckIn(null);
        }
      } catch (error) {
        console.error("🔥 Error fetching today's check-in:", error);
        setCheckIn(null);
      }
    };

    fetchCheckIn();
  }, [refreshTrigger]);

  return checkIn;
}
