import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // if not already imported
import { ensureUserDocumentExists } from "./firestore"; // Adjust the import path as necessary
// Sign Up Function
export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", (error as Error).message);
    throw error;
  }
}

// Sign In Function
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await ensureUserDocumentExists();

    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", (error as Error).message);
    throw error;
  }
}

// Sign Out Function
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", (error as Error).message);
  }
}
export async function deleteAccount() {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");

    await deleteUser(user);
    await deleteDoc(doc(db, "users", user.uid));
    console.log("User Firestore document deleted.");

    console.log("User account deleted successfully.");
  } catch (error: any) {
    console.error("Error deleting account:", error.message);


    if (error.code === "auth/requires-recent-login") {
      throw new Error("Please re-authenticate and try again.");
    }

    throw error;
  }
}

export { auth }; 
