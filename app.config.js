import "dotenv/config"; // loads from .env

export default {
  expo: {
    name: "vira",
    slug: "vira",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Vira.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/Vira.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/vira.png",
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/vira.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },

    extra: {
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
    },
  },
};
