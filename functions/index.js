const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.sendPushNotification = functions.https.onCall(async (data, context) => {
  console.log("📥 Incoming data to Cloud Function:", data);
  const {expoPushToken, title, body} = data.data || {};


  if (!expoPushToken) {
    console.error("❌ No expoPushToken provided");
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing Expo token.",
    );
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: {withSome: "data"},
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log("✅ Push response:", result);
    return result;
  } catch (error) {
    console.error("🔥 Error sending push notification:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to send push notification.",
    );
  }
});
