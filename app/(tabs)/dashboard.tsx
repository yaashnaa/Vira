import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { auth } from "@/config/firebaseConfig";
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
      if (!user) router.replace("/(auth)/login");
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const onboarded = await isOnboardingComplete();
      const quizDone = await isQuizCompletedInFirestore(uid);
      if (!onboarded) router.replace("/(auth)/OnBoarding");
      else if (!quizDone) router.replace("/quizzes/basic");
    };
    checkProgress();
  }, []);

  useEffect(() => {
    const checkScreening = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const completed = await isScreeningQuizCompleted(uid);
      setHasCompletedScreening(completed);
    };
    checkScreening();
  }, []);

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
        <ActivityIndicator size="large" color={lightTheme.primary} />
        <LogoutButton />
      </View>
    );
  }

  return (
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  section: {
    marginBottom: 30,
    alignItems: "center",
  },
});
