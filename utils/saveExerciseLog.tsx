// utils/saveExerciseLog.ts
import { collection, addDoc, Timestamp,orderBy, query, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";
import dayjs from "dayjs";

interface ExerciseLogEntry {
    exercise: string;
    duration: number;
    moodAfter?: string | null;
}

export const saveExerciseLog = async ({
    userId,
    description,
    moodAfter,
  }: {
    userId: string;
    description: string;
    moodAfter: number;
  }) => {
    try {
      await addDoc(collection(db, "users", userId, "exerciseLogs"), {
        description,
        moodAfter,
        timestamp: Timestamp.now(),
      });
      console.log("✅ Exercise log saved to Firestore!");
    } catch (error) {
      console.error("🔥 Error saving exercise log:", error);
    }
  };
  
  export const fetchExerciseLogs = async (userId: string) => {
    try {
      const logsRef = collection(db, "users", userId, "exerciseLogs");
      const q = query(logsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
  
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("🔥 Error fetching exercise logs:", error);
      return [];
    }
  };