import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../context/userPreferences'; // Adjust the import path as necessary

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
