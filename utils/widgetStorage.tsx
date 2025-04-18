// utils/widgetStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserWidgetKey = (uid: string) => `@enabledWidgets_${uid}`;

export const getEnabledWidgets = async (uid: string): Promise<string[]> => {
  try {
    const value = await AsyncStorage.getItem(getUserWidgetKey(uid));
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error("❌ Failed to get enabled widgets:", e);
    return [];
  }
};

export const setEnabledWidgets = async (uid: string, widgets: string[]) => {
  try {
    await AsyncStorage.setItem(getUserWidgetKey(uid), JSON.stringify(widgets));
  } catch (e) {
    console.error("❌ Failed to save enabled widgets:", e);
  }
};

export const addWidget = async (uid: string, widgetId: string) => {
  const current = await getEnabledWidgets(uid);
  if (!current.includes(widgetId)) {
    await setEnabledWidgets(uid, [...current, widgetId]);
  }
};

export const removeWidget = async (uid: string, widgetId: string) => {
  const current = await getEnabledWidgets(uid);
  const updated = current.filter((id) => id !== widgetId);
  await setEnabledWidgets(uid, updated);
};
