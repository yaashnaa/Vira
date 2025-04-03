import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { UserPreferences } from "../context/userPreferences";
import dayjs from "dayjs";
import { auth } from "../config/firebaseConfig";
// ✅ Centralized user data under /users/{userId}
export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    await setDoc(doc(db, "users", userId), { preferences }, { merge: true });
    console.log("✅ User preferences saved to Firestore successfully!");
  } catch (error) {
    console.error("🔥 Error saving user preferences to Firestore: ", error);
  }
};

// ✅ Store mood logs under /users/{userId}/moods/{date}
export const saveMoodLog = async (userId: string, value: string) => {
  const dateStr = dayjs().format("YYYY-MM-DD");
  try {
    await setDoc(
      doc(db, "users", userId, "moods", dateStr),
      { mood: value, date: dateStr },
      { merge: true }
    );
    console.log("✅ Mood log saved successfully!");
  } catch (error) {
    console.error("🔥 Error saving mood log: ", error);
  }
};

export const ensureUserDocumentExists = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: auth.currentUser?.displayName || "", // you can customize this
      createdAt: new Date(),
    });
    console.log("✅ Created new user document for UID:", uid);
  } else {
    console.log("ℹ️ User document already exists for UID:", uid);
  }
};