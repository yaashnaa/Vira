// utils/localStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { UserPreferences } from '../context/userPreferences';

const PREFS_KEY_PREFIX = '@prefs_';
const MOOD_KEY_PREFIX = '@moods_';
const ONBOARDING_KEY = '@onboardingComplete';
const QUIZ_KEY = '@quizComplete';

// Save user preferences to local storage using Firebase Auth UID
export const storePreferencesLocally = async (uid: string, preferences: UserPreferences) => {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(PREFS_KEY_PREFIX + uid, jsonValue);
    console.log('Preferences saved locally for UID:', uid);
  } catch (error) {
    console.error('Error saving preferences locally:', error);
  }
};

export const loadPreferencesLocally = async (uid: string): Promise<UserPreferences | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PREFS_KEY_PREFIX + uid);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading preferences locally:', error);
    return null;
  }
};

// Save today's mood for current user
export const logMoodLocally = async (uid: string, mood: number) => {
  try {
    const key = MOOD_KEY_PREFIX + uid;
    const today = dayjs().format('YYYY-MM-DD');
    const existing = await AsyncStorage.getItem(key);
    const moods = existing ? JSON.parse(existing) : {};
    moods[today] = mood;
    await AsyncStorage.setItem(key, JSON.stringify(moods));
    console.log(`Mood ${mood} saved locally for ${uid} on ${today}`);
  } catch (error) {
    console.error('Error saving mood locally:', error);
  }
};

// Load all mood logs for the current user
export const getMoodHistory = async (uid: string): Promise<{ [date: string]: number }> => {
  try {
    const key = MOOD_KEY_PREFIX + uid;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading mood history locally:', error);
    return {};
  }
};

export const markOnboardingComplete = async () => {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
};

export const markQuizComplete = async () => {
  await AsyncStorage.setItem(QUIZ_KEY, 'true');
};

export const isQuizComplete = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(QUIZ_KEY);
  return value === 'true';
};
