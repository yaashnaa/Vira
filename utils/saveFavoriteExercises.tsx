// utils/saveFavoriteExercises.ts

import { db, auth } from "@/config/firebaseConfig";
import { doc, deleteDoc, collection, getDocs, setDoc } from "firebase/firestore";

/**
 * Save one exercise as a separate document.
 */
export const saveFavoriteExercise = async (exercise: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  const exerciseId = exercise.name.replace(/\s+/g, "_").toLowerCase();
  const exerciseRef = doc(db, "users", userId, "favorites", exerciseId);

  try {
    await setDoc(exerciseRef, {
      ...exercise,
      savedAt: new Date(),
    });
  } catch (error) {
    console.error("Error saving favorite exercise:", error);
    throw error;
  }
};

import { ExerciseProps } from "@/utils/api/fetchExerciseData";

export const fetchFavoriteExercises = async (): Promise<ExerciseProps[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);

    const favorites: ExerciseProps[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // optional
        name: data.name,
        type: data.type,
        muscle: data.muscle,
        equipment: data.equipment,
        difficulty: data.difficulty,
        instructions: data.instructions,
      };
    });

    return favorites;
  } catch (error) {
    console.error("Error fetching favorite exercises:", error);
    return [];
  }
};

/**
 * Delete an exercise by its ID.
 */
export const deleteFavoriteExercise = async (exerciseName: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const exerciseId = exerciseName.replace(/\s+/g, "_").toLowerCase();
  const exerciseRef = doc(db, "users", userId, "favorites", exerciseId);

  try {
    await deleteDoc(exerciseRef);
    console.log("Deleted favorite:", exerciseName);
  } catch (error) {
    console.error("Error deleting favorite exercise:", error);
  }
};
