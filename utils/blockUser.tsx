import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";

export const blockUser = async (blockedUserId: string) => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId || !blockedUserId) return;

  await setDoc(
    doc(db, "users", currentUserId, "blockedUsers", blockedUserId),
    {
      blockedAt: serverTimestamp(),
    }
  );
};
