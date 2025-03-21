import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

