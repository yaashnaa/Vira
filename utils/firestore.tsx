import { doc, setDoc, getDoc, addDoc, collection, Timestamp, serverTimestamp, getDocs} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { UserPreferences } from "../context/userPreferences";
import dayjs from "dayjs";
import { auth } from "../config/firebaseConfig";

export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    await setDoc(doc(db, "users", userId, "preferences", "main"), preferences, { merge: true });
    console.log("✅ User preferences saved to Firestore successfully!");
  } catch (error) {
    console.error("🔥 Error saving user preferences to Firestore: ", error);
  }
};

export const logMealToFirestore = async (uid: string, mealData: any) => {
  const mealDocRef = doc(collection(db, "users", uid, "meals"));
  await setDoc(mealDocRef, {
    ...mealData,
    timestamp: serverTimestamp(),
  });
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

export const markQuizCompletedInFirestore = async (uid: string) => {
  try {
    await setDoc(doc(db, "users", uid), { quizCompleted: true }, { merge: true });
  } catch (e) {
    console.error("Error marking quiz as completed in Firestore:", e);
  }
};

export const isQuizCompletedInFirestore = async (uid: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    return snap.exists() && snap.data().quizCompleted === true;
  } catch (e) {
    console.error("Error checking quiz completion in Firestore:", e);
    return false;
  }
};
export const markScreeningQuizCompleted = async (uid: string) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      { screeningQuizCompleted: true },
      { merge: true }
    );
    console.log("✅ Screening quiz marked as completed in Firestore");
  } catch (e) {
    console.error("❌ Error marking screening quiz as completed:", e);
  }
};

export const isScreeningQuizCompleted = async (uid: string): Promise<boolean> => {
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    return snap.exists() && snap.data().screeningQuizCompleted === true;
  } catch (e) {
    console.error("Error checking screening quiz completion:", e);
    return false;
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
export const saveJournalEntry = async (userId: string, entry: {
  title: string;
  body: string;
  tags: string[];
  sleepDuration: string;
  bedtime: string;
  wakeTime: string;
  quality: string;
}) => {
  try {
    await addDoc(collection(db, "users", userId, "journalEntries"), {
      ...entry,
      timestamp: Timestamp.now(),
    });
    console.log("✅ Journal entry saved to Firestore!");
  } catch (error) {
    console.error("🔥 Error saving journal entry:", error);
  }
};
export const fetchMealLogs = async (userId: string) => {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "meals"));
    const meals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return meals;
  } catch (error) {
    console.error("🔥 Error fetching meal logs: ", error);
    return [];
  }
};


export const fetchUserPreferences = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid, "preferences", "main");
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
};
