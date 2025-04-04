// app/(tabs)/home.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Animated,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import DeleteButton from "@/components/deleteAccount";
import { useMoodContext } from "@/context/moodContext";
import LogMoodButton from "@/components/logMoodBtn";
import RecommendedWidgetsBanner from "@/components/recommendedWidegts";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { lightTheme } from "@/config/theme";
import { resetOnboarding } from "../utils/resetOnboarding";
import LogoutButton from "@/components/logoutButton";
import FadeInText from "@/components/fadeInText";
import AddWidgetButton from "@/components/addWidgets";
import BasicButton from "@/components/basicButton";
import Quotes from "./quotes";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import TakeQuizButton from "@/components/takeQuiz";
import MoodCalendar from "../components/moodCalender";
import { UserPreferences, useUserPreferences } from "@/context/userPreferences";
import { isOnboardingComplete, isQuizComplete } from "@/utils/asyncStorage";
import { auth } from "@/config/firebaseConfig";
export default function Dashboard() {
  const router = useRouter();
  const { userPreferences, loading } = useUserPreferences();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  const { hasLoggedToday, logMood } = useMoodContext();
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("Logged in user:");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Display Name:", user.displayName);
    } else {
      console.log("No user is logged in");
    }
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("No user logged in – redirecting...");
        router.replace("/(auth)/login");
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkProgress = async () => {
      const onboarded = await isOnboardingComplete();
      const quizDone = await isQuizComplete();

      if (!onboarded) {
        router.replace("/(auth)/OnBoarding");
      } else if (!quizDone) {
        router.replace("/quizzes/basic");
      }
    };

    checkProgress();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const handleQuizPress = () => {
    router.push("/quizzes/screening");
  };
  const handleLogMeal = () => {
    // Navigate to the meal logging screen
    router.push("/nurtition");
  };

  const handlePersonalize = () => {
    router.push("/quizzes/screening");
  };
  const handleStartWorkout = () => {
    // Navigate to the fitness/workout screen
    router.push("/fitness");
  };
  const handleLogMood = async () => {
    router.push("/mood");
  };
  const handleSettings = async () => {
    router.push("/settings");
  };
  const data = [{ key: "dashboard" }];
  const mood = () => {
    router.push("/mood");
  };
  if (loading || !auth.currentUser || !userPreferences?.name|| !userPreferences.hasOwnProperty("moodCheckIn")) {
    return (
      <View>
        <ActivityIndicator size="large" color={lightTheme.primary} />
        <LogoutButton />
        <Text> no user</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={() => (
          <View>
            <FadeInText style={styles.title}>
              Hello, {userPreferences?.name} 👋
            </FadeInText>

            <View style={styles.snapshotContainer}>
              <Text style={styles.snapshotTitle}>Today's Quote</Text>
              <Text>Quote will be here</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <DeleteButton />
              <LogoutButton />
              {userPreferences.moodCheckIn && (
                <LogMoodButton
                  onPress={handleLogMood}
                  isLogged={hasLoggedToday}
                />
              )}
            </View>
            <Button onPress={handleLogMeal} title="Log Meal" />
            <Button onPress={handleSettings} title="Settings" />
            <MoodCalendar />
            <TakeQuizButton onPress={handleQuizPress} />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AddWidgetButton />
            </View>

            <RecommendedWidgetsBanner />

            <View style={{ marginTop: 20 }}>
              <Button title="Reset Onboarding" onPress={resetOnboarding} />
              <Button title="Personalise" onPress={handlePersonalize} />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    flexGrow: 1,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Title-font-regular",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  snapshotContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  snapshotTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  snapshotText: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  recommendationContainer: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderRadius: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  recommendationText: {
    fontSize: 16,
  },
});
