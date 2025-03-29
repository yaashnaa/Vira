import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { UserPreferences } from "../context/userPreferences";

export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    await setDoc(doc(db, "userPreferences", userId), preferences, { merge: true });
    console.log("User preferences saved to Firestore successfully!");
  } catch (error) {
    console.error("Error saving user preferences to Firestore: ", error);
  }
};
