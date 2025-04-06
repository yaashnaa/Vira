// utils/saveExerciseLog.ts
import { collection, addDoc, Timestamp } from "firebase/firestore";
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
  