// utils/firestoreSafe.ts
import {
    getDoc,
    getDocFromCache,
    DocumentReference,
    FirestoreError,
  } from "firebase/firestore";
  
  export async function safeGetDoc<T>(
    ref: DocumentReference<T>
  ): Promise<T | null> {
    try {
      const snap = await getDoc(ref); // online or cached
      return snap.exists() ? (snap.data() as T) : null;
    } catch (err) {
      const code = (err as FirestoreError).code;
      if (code === "unavailable" || code === "failed-precondition") {
        // network-down path
        try {
          const snap = await getDocFromCache(ref); // ⬅ cache-only helper
          return snap.exists() ? (snap.data() as T) : null;
        } catch {
          /* cache miss – fall through */
        }
      }
      console.error("safeGetDoc failed:", err);
      return null;
    }
  }
  