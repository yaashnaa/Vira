    import * as Device from "expo-device";
    import * as Notifications from "expo-notifications";
    import { Platform } from "react-native";
    import Constants from "expo-constants";

      
    export async function registerForPushNotificationsAsync() {
    let token;


    try {
        if (!Device.isDevice) {
        alert("Must use physical device for Push Notifications");
        console.log("❌ Not a physical device");
        return;
        }

        const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
        console.log("📋 Existing permission status:", existingStatus);

        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }

        if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        console.log("❌ Permission not granted");
        return;
        }

        const response = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId ?? "edd0899f-b5dc-488c-9013-81fe43cf72fc",
        });
        token = response.data;
        console.log("✅ Expo push token:", token);

        if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
        }

        return token;
    } catch (err) {
        console.error("🔥 Error during push registration:", err);
        alert("Error while registering for notifications");
    }
    }
