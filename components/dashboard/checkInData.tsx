
import { useEffect, useState } from 'react';
import { auth, db } from '@/config/firebaseConfig';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import { DocumentData } from 'firebase/firestore';
export function useCheckInData(refreshKey: any) {

  
  const [latestCheckIn, setLatestCheckIn] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchCheckIn = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const today = dayjs().format("YYYY-MM-DD");

      const q = query(
        collection(db, "users", uid, "checkins"),
        where("date", "==", today),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setLatestCheckIn(snapshot.docs[0].data());
      } else {
        setLatestCheckIn(null);
      }
    };

    fetchCheckIn();
  }, [refreshKey]);

  return latestCheckIn;
}


