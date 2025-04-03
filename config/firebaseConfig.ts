import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// declare module "@env" {
//   export const FIREBASE_API_KEY: string;
//   export const FIREBASE_AUTH_DOMAIN: string;
//   export const FIREBASE_PROJECT_ID: string;
//   export const FIREBASE_STORAGE_BUCKET: string;
//   export const FIREBASE_MESSAGING_SENDER_ID: string;
//   export const FIREBASE_APP_ID: string;
//   export const FIREBASE_MEASUREMENT_ID: string;
// }

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrTuHp59HPW4GPg6EyPPZ6PFmNMKMk5GU",
  authDomain: "vira-d024f.firebaseapp.com",
  projectId: "vira-d024f",
  storageBucket: "vira-d024f.appspot.com",
  messagingSenderId: "379116480076",
  appId: "1:379116480076:web:b974726aac4a257877b6e9",
  measurementId: "G-5TDCLQ9B6G",
 };

 const app = initializeApp(firebaseConfig);

 // ✅ Use initializeAuth with AsyncStorage to persist login
 const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(AsyncStorage),
 });
 
 const db = getFirestore(app);
 
 export { app, auth, db };