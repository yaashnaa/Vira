import * as Notifications from "expo-notifications";

/**
 * Cancel all previously scheduled notifications.
 */
export async function clearAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("🧹 Cleared all scheduled notifications");
  } catch (error) {
    console.error("❌ Failed to clear notifications:", error);
  }
}

/**
 * Schedule daily notifications based on selected reminder frequency.
 * @param frequency - User's selected reminder frequency
 */
export async function scheduleUserNotifications(frequency: string) {
  try {
    // Step 1: Clear existing ones
    await clearAllScheduledNotifications();

    // Step 2: Choose times based on user setting
    let times: { hour: number; minute: number }[] = [];

    switch (frequency) {
      case "Minimal (1x per day)":
        times = [{ hour: 12, minute: 0 }];
        break;
      case "Standard (2–3x per day)":
        times = [
          { hour: 10, minute: 0 },
          { hour: 15, minute: 0 },
        ];
        break;
      case "Frequent (throughout the day)":
        times = [
          { hour: 9, minute: 0 },
          { hour: 13, minute: 0 },
          { hour: 19, minute: 0 },
        ];
        break;
      default:
        console.log("ℹ️ No reminders selected");
        return;
    }

    // Step 3: Schedule new ones
    for (const time of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🌸 Gentle Reminder",
          body: "Take a moment to check in with yourself.",
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
    

    console.log("✅ Notifications scheduled based on:", frequency);
  } catch (error) {
    console.error("❌ Error scheduling notifications:", error);
  }
}
