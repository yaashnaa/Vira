import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const migrateNameToPreferences = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const prefsRef = doc(db, "users", uid, "preferences", "main");

    const userSnap = await getDoc(userRef);
    const prefsSnap = await getDoc(prefsRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const prefsData = prefsSnap.exists() ? prefsSnap.data() : {};

      if (userData.name && !prefsData.name) {
        await setDoc(prefsRef, { ...prefsData, name: userData.name }, { merge: true });
        console.log("✅ Migrated name to preferences/main");
      }
    }
  } catch (err: any) {
    if (err.message?.includes("client is offline")) {
      console.warn("⚠️ Skipped name migration — client offline.");
    } else {
      console.error("⚠️ Error migrating name to preferences:", err);
    }
  }
};
