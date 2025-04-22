import { db } from "@/config/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth } from "@/config/firebaseConfig";

const getJournalRef = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User not authenticated");
  return collection(db, "users", uid, "journalEntries");
};

export const saveJournalEntry = async ({
  moodEntered,
  prompt,
  response,
  freeWrite,
}: {
  moodEntered: string;
  prompt?: string;
  response?: string;
  freeWrite?: string;
}) => {
  const ref = getJournalRef();
  const entry = {
    moodEntered,
    prompt: prompt || null,
    response: response || null,
    freeWrite: freeWrite || null,
    timestamp: Timestamp.now(),
  };
  await addDoc(ref, entry);
};

export const getJournalEntries = async () => {
  const ref = getJournalRef();
  const q = query(ref, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
