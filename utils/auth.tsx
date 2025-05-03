import { auth } from "../config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser, sendPasswordResetEmail
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { db } from "../config/firebaseConfig"; // if not already imported
import { ensureUserDocumentExists } from "./firestore"; // Adjust the import path as necessary
// Sign Up Function
export async function registerUser(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
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
/**
 * Send a password reset email to the given address.
 * @param email the user's email
 */
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    Toast.show({
      type: "success",
      text1: "Password Reset Email Sent",
      text2: `Check ${email} to reset your password.`,
    });
  } catch (error: any) {
    console.error("Error sending reset email:", error);
    let message = "Failed to send reset email.";
    if (error.code === "auth/invalid-email") {
      message = "That email address is not valid.";
    } else if (error.code === "auth/user-not-found") {
      message = "No account found with that email.";
    }
    Toast.show({ type: "error", text1: message });
    throw error;
  }
}

export { auth };
