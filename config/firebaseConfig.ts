import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

// const db = getFirestore(app);
// const storage = getStorage(app);


// export { app, auth, db, storage };
export const auth= getAuth(app);