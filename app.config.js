import "dotenv/config";

export default {
  expo: { 
    name: "Vira",
    slug: "vira",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "vira",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.yaashna.vira",
      supportsTablet: true,
      buildNumber: "23",
      infoPlist: {
        NSAppTransportSecurity: {
          NSExceptionDomains: {
            "firebaseapp.com": {
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
              NSTemporaryExceptionMinimumTLSVersion: "TLSv1.2"
            },
            "googleapis.com": {
              NSIncludesSubdomains: true,
              NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
              NSTemporaryExceptionMinimumTLSVersion: "TLSv1.2"
            }
          }
        }
      }
      
    },
       
    android: {
      package: "com.yaashna.vira",
      versionCode: 23,
      adaptiveIcon: {
        foregroundImage: "./assets/images/vira.png",
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
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static",
            "modularHeaders": true
          }
        }
      ],
      ["expo-font"],
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
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
      expoClientId:
        "379116480076-fm59utduk6k817ojgvtrhsqjh9m3cner.apps.googleusercontent.com",
    },
  },
};
