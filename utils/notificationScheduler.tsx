import * as Notifications from "expo-notifications";

/**
 * Cancel all previously scheduled notifications.
 */
const encouragementMessages: Record<
  EncouragementType,
  { title: string; body: string }
> = {
  "Gentle & Kind": {
    title: "🌸 Gentle Nudge",
    body: "You're doing your best. Take a soft breath. 🌿",
  },
  "Cheerful & Motivating": {
    title: "🚀 Keep Going!",
    body: "You're unstoppable! Keep shining today! ✨",
  },
  Minimal: {
    title: "🔔 Reminder",
    body: "Check in when you can.",
  },
  None: {
    title: "",
    body: "",
  },
};
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
export type EncouragementType =
  | "Gentle & Kind"
  | "Cheerful & Motivating"
  | "Minimal"
  | "None";

export async function scheduleUserNotifications(
  frequency: string,
  encouragement: EncouragementType
) {
  try {
    await clearAllScheduledNotifications();

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

    // 💬 Pick message based on encouragement style
    const selectedMessage =
      encouragementMessages[encouragement] ?? encouragementMessages["Minimal"];

    for (const time of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: selectedMessage.title,
          body: selectedMessage.body,
          sound: "default", // or dynamic based on user sound selection if you want
        },
        trigger: {
          type: "calendar",
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });
    }

    console.log(
      "✅ Notifications scheduled based on:",
      frequency,
      encouragement
    );
  } catch (error) {
    console.error("❌ Error scheduling notifications:", error);
  }
}

