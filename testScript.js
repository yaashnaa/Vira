const fetch = require("node-fetch");

const sendPushNotification = async () => {
  const message = {
    to: "ExponentPushToken[SZZGPHHpcuMOz2Xz8ZzD4V]",
    sound: "default",
    title: "Test Notification 🎯",
    body: "This is a test message sent via Expo!",
    data: { someData: "goes here" },
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await response.json();
  console.log(data);
};

sendPushNotification();
