import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, getDoc } from "firebase/firestore";

/**
 * Fetch a user's Expo Push Token from Firestore and send a notification
 * using the deployed Cloud Function `sendPushNotification`.
 *
 * @param {string} uid - The Firebase UID of the user to notify
 * @param {Object} payload - Notification payload (title, body)
 */
export async function fetchAndSendPushNotification(uid, payload) {
  try {
    const db = getFirestore();
    const functions = getFunctions();
    const sendPush = httpsCallable(functions, "sendPushNotification");

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      throw new Error("User not found in Firestore");
    }

    const userData = userDoc.data();
    // console.log("📦 Fetched userData:", userData); // 👈 add this

    const expoPushToken = userData?.expoPushToken;
    console.log("📮 Token inside fetch function:", expoPushToken); // 👈 add this

    if (!expoPushToken) {
      throw new Error("Expo Push Token not found for this user");
    }

    // // 2️⃣ Call the cloud function with token and message
    // console.log("📬 Sending to token:", expoPushToken);
    // console.log("📬 Payload:", { title: payload.title, body: payload.body });

    const res = await sendPush({
      expoPushToken,
      title: payload.title,
      body: payload.body,
    });

    console.log("✅ Notification sent:", res.data);
  } catch (err) {
    console.error("🔥 Failed to send push notification:", err.message);
  }
}
