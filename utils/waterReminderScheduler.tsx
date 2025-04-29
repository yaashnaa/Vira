// file: utils/waterReminderScheduler.ts
import * as Notifications from "expo-notifications";

export async function scheduleWaterReminders(frequency: number) {
  try {
    const startHour = 9;
    const endHour = 21;
    const waterTimes: { hour: number; minute: number }[] = [];

    for (let hour = startHour; hour <= endHour; hour += frequency) {
      waterTimes.push({ hour, minute: 0 });
    }

    for (const time of waterTimes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Water Break!",
          body: "Time to hydrate! 🚰",
          sound: "default",
        },
        trigger: {
          type: "calendar",
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });
    }

    console.log("✅ Water reminders scheduled every", frequency, "hours");
  } catch (error) {
    console.error("❌ Error scheduling water reminders:", error);
  }
}
