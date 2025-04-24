import { auth, db } from "@/config/firebaseConfig";
import * as Notifications from "expo-notifications";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import dayjs from "dayjs";

export async function checkAndScheduleDailyReminder(selectedTime: Date) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const q = query(
    collection(db, "users", uid, "checkins"),
    orderBy("timestamp", "desc"),
    limit(5)
  );

  const snapshot = await getDocs(q);
  const today = dayjs().format("YYYY-MM-DD");

  let hasCheckedInToday = false;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const docDate = dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD");
    if (docDate === today) {
      hasCheckedInToday = true;
      break;
    }
  }

  if (!hasCheckedInToday) {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const hour = selectedTime.getHours();
    const minute = selectedTime.getMinutes();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌱 Evening Check-In",
        body: "Take a moment to reflect on your day 💭",
        sound: "default",
      },
      trigger: {
        type: "calendar",
        hour,
        minute,
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });

    console.log(`✅ Notification scheduled at ${hour}:${minute}`);
  } else {
    console.log("✅ Already checked in today. Skipping notification.");
  }
}
