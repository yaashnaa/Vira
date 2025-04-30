import "dotenv/config";

export default {
  expo: {
    name: "vira",
    slug: "vira",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Vira.png",
    scheme: "vira",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.yaashna.vira",
      supportsTablet: true,
    },
    android: {
      package: "com.yaashna.vira",
      adaptiveIcon: {
        foregroundImage: "./assets/images/Vira.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/Vira.png",
    },
    plugins: [
      "expo-router",
      "expo-video",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/Vira.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    devClient: true,
    extra: {
      eas: {
        projectId: "edd0899f-b5dc-488c-9013-81fe43cf72fc",
      },
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      TASTY_API_KEY: process.env.TASTY_API_KEY,
      NUTRITIONIX_APP_ID: process.env.NUTRITIONIX_APP_ID,
      NUTRITIONIX_API_KEY: process.env.NUTRITIONIX_API_KEY,
      X_API_KEY: process.env.X_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      EXPO_PUSH_NOTIFICATION_KEY: process.env.EXPO_PUSH_NOTIFICATION_KEY,
      expoClientId: "379116480076-fm59utduk6k817ojgvtrhsqjh9m3cner.apps.googleusercontent.com"
    },
  },
};
