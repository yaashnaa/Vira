import Constants from "expo-constants";
import { auth, db } from "@/config/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
const APP_ID = Constants.expoConfig?.extra?.NUTRITIONIX_APP_ID;
const API_KEY = Constants.expoConfig?.extra?.NUTRITIONIX_API_KEY;

export async function getNutritionData(query: string) {
  const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": APP_ID,
      "x-app-key": API_KEY,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error("Nutritionix API error");
  return res.json();
}

async function deleteMeal(mealId: string) {
    const user = auth.currentUser;
    if (!user) return;
  
    const docRef = doc(db, "users", user.uid, "loggedMeals", mealId);
    await deleteDoc(docRef);
    console.log("🗑️ Meal deleted:", mealId);
  }
  