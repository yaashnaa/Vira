import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
  Text, Image, 
} from "react-native";
import { OfflineWrapper } from "@/components/OfflineWrapper";
import { useFocusEffect, useRouter } from "expo-router";
import { auth } from "@/config/firebaseConfig";
import Toast from "react-native-toast-message";
import {
  getEnabledWidgets,
  addWidget,
  removeWidget as removeWidgetFromStorage,
} from "@/utils/widgetStorage";
import { isOnboardingComplete } from "@/utils/asyncStorage";
import {
  isQuizCompletedInFirestore,
  isScreeningQuizCompleted,
} from "@/utils/firestore";
import { useUserPreferences } from "@/context/userPreferences";
import { useCheckInContext } from "@/context/checkInContext";
import { ImageBackground } from "react-native";
import DashboardHeader from "@/components/dashboard/dashboardHader";
import { useCheckInData } from "@/hooks/useCheckInData";
import PinnedWidgetsSection from "@/components/dashboard/pinnedWidgets";
import OfflineNotice from "@/components/offlineComponent";
import { addTaskToQueue } from "@/utils/firebaseOfflineQueue";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";

import LogMoodButton from "@/components/Buttons/logMoodBtn";
import TakeQuizButton from "@/components/takeQuiz";
import CombinedCheckInCard from "../combinedCheckInCard";
import LogoutButton from "@/components/Buttons/logoutButton";
import { lightTheme } from "@/config/theme";

const { width, height } = Dimensions.get("window");
const dashboardSections = [
  "greeting",
  "checkinCard",
  "logMood",
  "quiz",
  "pinnedWidgets",
];

export default function Dashboard() {
  const router = useRouter();
  const { userPreferences, loading } = useUserPreferences();
  const { hasCheckedInToday } = useCheckInContext();

  const [authReady, setAuthReady] = useState(false);
  const [enabledWidgets, setEnabledWidgetsState] = useState<string[]>([]);
  const [hasCompletedScreening, setHasCompletedScreening] = useState(false);
  const [widgetChangeTrigger, setWidgetChangeTrigger] = useState(0);
  const latestCheckIn = useCheckInData(widgetChangeTrigger);
  const [isOffline, setIsOffline] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // 👈
  // async function checkConnection() {
  //   const networkState = await Network.getNetworkStateAsync();
  //   console.log("Is connected?", networkState.isConnected);
  // }

  // useFocusEffect(
  //   useCallback(() => {
  //     async function checkNetwork() {
  //       const networkState = await Network.getNetworkStateAsync();
  //       setIsConnected(networkState.isConnected ?? false);
  //     }

  //     checkNetwork();
  //   }, [])
  // );
  useEffect(() => {
    const logAsyncStorageData = async () => {
      try {
        const onboardingComplete =
          await AsyncStorage.getItem("onboardingComplete");
        console.log("📦 onboardingComplete:", onboardingComplete);

        const userPreferences = await AsyncStorage.getItem("userPreferences");
        console.log("📦 userPreferences:", JSON.parse(userPreferences || "{}"));
      } catch (error) {
        console.error("❌ Error reading from AsyncStorage:", error);
      }
    };

    logAsyncStorageData();
  }, []);
  const dumpAsyncStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    items.forEach(([key, value]) => {
      console.log(`🧾 ${key}:`, value);
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
      if (!user) router.replace("/login");
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const onboarded = await isOnboardingComplete();
      const quizDone = await isQuizCompletedInFirestore(uid);
      if (!onboarded) router.replace("/OnBoarding");
      else if (!quizDone) router.replace("/quizzes/basic");
    };
    checkProgress();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkScreening = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const completed = await isScreeningQuizCompleted(uid);
        setHasCompletedScreening(completed);
      };
      checkScreening();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const loadWidgets = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const stored = await getEnabledWidgets(uid);
        setEnabledWidgetsState(stored);
      };
      loadWidgets();
    }, [widgetChangeTrigger])
  );

  const handleAddWidget = useCallback(async (widgetId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await addWidget(uid, widgetId);
    setWidgetChangeTrigger((prev) => prev + 1);
  }, []);

  const handleRemoveWidget = async (uid: string, widgetId: string) => {
    await removeWidgetFromStorage(uid, widgetId);
    setWidgetChangeTrigger((prev) => prev + 1);
  };

  if (loading || !userPreferences?.name || !authReady || !auth.currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/loading.png")} 
            style={styles.mascot}
          />
          <Text style={styles.loadingText}>
            Hey {userPreferences?.name || "friend"}!{"\n"}Loading your cozy
            space…
          </Text>
          <ActivityIndicator
            size="large"
            color={lightTheme.primary}
            style={styles.spinner}
          />
          <View style={styles.logoutButton}>
            <LogoutButton />
          </View>
        </View>
      </View>
    );
  }

  return (
    <OfflineWrapper>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("@/assets/images/dashboard/bg.png")} // ← your original path
          style={styles.background}
          resizeMode="cover"
        >
          <FlatList
            data={dashboardSections}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingBottom: 50 }}
            renderItem={({ item }) => {
              switch (item) {
                case "greeting":
                  return <DashboardHeader userName={userPreferences.name} />;
                case "checkinCard":
                  if (!userPreferences.moodcCheckInBool || !hasCheckedInToday)
                    return null;
                  return (
                    <View style={styles.section}>
                      <CombinedCheckInCard />
                    </View>
                  );
                case "logMood":
                  if (!userPreferences.moodcCheckInBool || hasCheckedInToday)
                    return null;
                  return (
                    <TouchableOpacity
                      onPress={() => router.push("/checkInScreen")}
                    >
                      <LogMoodButton latestCheckIn={latestCheckIn} />
                      {/* <Button onPress={()=> dumpAsyncStorage()} title="Dump AsyncStorage" /> */}
                    </TouchableOpacity>
                  );
                case "quiz":
                  if (hasCompletedScreening) return null;
                  return (
                    <View style={styles.section}>
                      <TakeQuizButton
                        onPress={() => router.push("../quizzes/screening")}
                      />
                    </View>
                  );
                case "pinnedWidgets":
                  return (
                    <PinnedWidgetsSection
                      enabledWidgets={enabledWidgets}
                      uid={auth.currentUser?.uid || ""}
                      onAdd={handleAddWidget}
                      onRemove={handleRemoveWidget}
                      triggerRefresh={widgetChangeTrigger}
                    />
                  );
                default:
                  return null;
              }
            }}
          />
        </ImageBackground>
      </SafeAreaView>
    </OfflineWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "transparent",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },

  section: {
    marginBottom: 30,
    alignItems: "center",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F8FC",
    paddingHorizontal: 20,
  },
  offlineText: {
    fontSize: 18,
    color: "#5A3E9B",
    textAlign: "center",
    fontFamily: "Main-font",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff7fb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  mascot: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#86508f",
    fontFamily: "PatrickHand-Regular",
    marginBottom: 16,
    lineHeight: 24,
  },
  spinner: {
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: "#f8d7da",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
