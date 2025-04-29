// utils/fetchExerciseData.ts
import Constants from "expo-constants";
import axios from "axios";

export interface ExerciseProps {
  id?: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export async function fetchExerciseData(
  muscle = "",
  type = "",
  difficulty = ""
): Promise<ExerciseProps[]> {
  const url = `https://api.api-ninjas.com/v1/exercises`;

  const params: any = {};
  if (muscle) params.muscle = muscle;
  if (type) params.type = type;
  if (difficulty) params.difficulty = difficulty;

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        "X-Api-Key": Constants.expoConfig?.extra?.X_API_KEY,
      },
    });

    return response.data as ExerciseProps[];
  } catch (error) {
    console.error("🔥 Error fetching exercises:", error);
    throw new Error("Failed to fetch exercises from API");
  }
}
