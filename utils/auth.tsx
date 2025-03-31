import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

// ✅ Sign Up Function
export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", (error as Error).message);
    throw error;
  }
}

// ✅ Sign In Function
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", (error as Error).message);
    throw error;
  }
}

// ✅ Sign Out Function
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", (error as Error).message);
  }
}
