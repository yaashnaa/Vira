import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../context/userPreferences'; // Adjust the import path as necessary
import dayjs from 'dayjs';
const STORAGE_KEY = '@user_preferences';

export const storePreferencesLocally = async (preferences: UserPreferences) => {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Preferences saved locally.');
  } catch (error) {
    console.error('Error saving preferences: ', error);
  }
};

export const loadPreferencesLocally = async (): Promise<UserPreferences | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading preferences: ', error);
    return null;
  }
};

// Key in AsyncStorage
const USER_STORAGE_KEY = "@multi_user_mood_logs";

interface MultiUserData {
  currentUser: string | null;
  userMoods: {
    [username: string]: { [date: string]: number };
  };
}

async function loadMultiUserData(): Promise<MultiUserData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error("Error loading data:", e);
  }
  return { currentUser: null, userMoods: {} };
}

async function saveMultiUserData(data: MultiUserData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data:", e);
  }
}

// Example usage: setting current user
async function setCurrentUser(username: string) {
  const data = await loadMultiUserData();
  data.currentUser = username;
  if (!data.userMoods[username]) {
    data.userMoods[username] = {};
  }
  await saveMultiUserData(data);
}

// Example usage: logging mood
async function logMoodForCurrentUser(moodValue: number) {
  const data = await loadMultiUserData();
  if (!data.currentUser) {
    console.warn("No current user set!");
    return;
  }
  const today = dayjs().format("YYYY-MM-DD");
  data.userMoods[data.currentUser][today] = moodValue;
  await saveMultiUserData(data);
}

