import { db, auth } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {generateUsername} from "unique-username-generator";


const getOrCreateUsername = async (uid: string): Promise<string> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && userSnap.data().username) {
    return userSnap.data().username;
  }

  const newUsername = generateUsername("-", 2, 6); // e.g., "sunny-forest-91"

  await setDoc(userRef, { username: newUsername }, { merge: true });

  return newUsername;
};


export const listenToPosts = (category: string, onUpdate: (posts: any[]) => void) => {
    const q = query(collection(db, "discussions", category, "posts"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onUpdate(posts);
    });
  };
  
  export const createPost = async (category: string, text: string) => {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;
  
    const username = await getOrCreateUsername(user.uid);
  
    const post = {
      text: text.trim(),
      userId: user.uid,
      name: username,
      timestamp: serverTimestamp(),
    };
  
    await addDoc(collection(db, "discussions", category, "posts"), post);
  };
  
  export const listenToComments = (category: string, postId: string, onUpdate: (comments: any[]) => void) => {
    const q = query(collection(db, "discussions", category, "posts", postId, "comments"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onUpdate(comments);
    });
  };
  
  export const createComment = async (category: string, postId: string, text: string) => {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;
  
    const username = await getOrCreateUsername(user.uid);
  
    const comment = {
      text: text.trim(),
      userId: user.uid,
      name: username,
      timestamp: serverTimestamp(),
    };
  
    await addDoc(collection(db, "discussions", category, "posts", postId, "comments"), comment);
  };
  