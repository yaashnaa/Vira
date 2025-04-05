// Redesigned Dashboard Layout with cleaner structure and visual hierarchy
import React, { useEffect, useRef, useState , useCallback} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Header as HeaderRNE, HeaderProps, Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useMoodContext } from "@/context/moodContext";
import { useUserPreferences } from "@/context/userPreferences";
import { isOnboardingComplete, isQuizComplete } from "@/utils/asyncStorage";
import { auth } from "@/config/firebaseConfig";
import { lightTheme } from "@/config/theme";
import { Animated } from "react-native";
import { isScreeningQuizComplete } from "@/utils/asyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Components
import FadeInText from "@/components/fadeInText";
import MoodCalendar from "@/components/moodCalender";
import LogMoodButton from "@/components/Buttons/logMoodBtn";
import LogoutButton from "@/components/Buttons/logoutButton";
import DeleteButton from "@/components/Buttons/deleteAccount";
import TakeQuizButton from "@/components/takeQuiz";
import RecommendedWidgetsBanner from "@/components/recommendedWidegts";
import NutritionScreen from "./nurtition";
import FitnessWidget from "@/components/widgets/FitnessWidget";
import NutritionWidget from "@/components/widgets/NutritionWidget";
// import JournalScreen from "./journal";
import JournalWidget from "@/components/widgets/JournalWidget";
import WaterWidget from "@/components/widgets/WaterWidget";
import MoodWidget from "@/components/widgets/MoodWidget";

export default function Dashboard() {
  const router = useRouter();
  const { userPreferences, loading } = useUserPreferences();
  const { hasLoggedToday } = useMoodContext();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(100)).current; // starts 100px down
  const [hasCompletedScreening, setHasCompletedScreening] =
    useState<boolean>(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.replace("/(auth)/login");
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  useEffect(() => {
    const checkScreening = async () => {
      const completed = await isScreeningQuizComplete();
      setHasCompletedScreening(completed);
    };
    checkScreening();
  }, []);
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);
  useFocusEffect(
    useCallback(() => {
      const loadWidgets = async () => {
        const stored = await AsyncStorage.getItem("@enabledWidgets");
        if (stored) {
          setEnabledWidgets(JSON.parse(stored));
        }
      };
  
      loadWidgets();
    }, [])
  );

  useEffect(() => {
    const checkProgress = async () => {
      const onboarded = await isOnboardingComplete();
      const quizDone = await isQuizComplete();
      if (!onboarded) router.replace("/(auth)/OnBoarding");
      else if (!quizDone) router.replace("/quizzes/basic");
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

  const handleNavigate = (route: Parameters<typeof router.push>[0]): void =>
    router.push(route);

  if (
    loading ||
    !auth.currentUser ||
    !userPreferences?.name ||
    !userPreferences.hasOwnProperty("moodCheckIn")
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={lightTheme.primary} />
        <LogoutButton />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#D7C4EB", // soft lilac or any color you want
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity>
            <Icon name="home" type="ionicon" color="#5A3E9B" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "",
          style: {
            color: "#3e2a6e",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "Main-font",
          },
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => handleNavigate("/manageWidgets")}>
              <Icon name="grid" type="feather" color="#5A3E9B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => handleNavigate("/settings")}
            >
              <Icon name="settings" type="feather" color="#5A3E9B" />
            </TouchableOpacity>
          </View>
        }
      />

      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.cont}
          data={[{ key: "dashboard" }]}
          renderItem={() => (
            <View>
              <Text style={styles.title}>Hello, {userPreferences.name} 👋</Text>

              <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Today's Quote</Text>
                  <Text style={styles.quote}>
                    “Your body is your home — treat it gently.”
                  </Text>
                </View>
              </Animated.View>

              {userPreferences.moodCheckIn && (
                <LogMoodButton
                  onPress={() => handleNavigate("/mood")}
                  isLogged={hasLoggedToday}
                />
              )}
              <ScrollView contentContainerStyle={styles.widgets}>
                <View style={styles.gridContainer}>
                  {enabledWidgets.includes("water") && <WaterWidget />}
                  {enabledWidgets.includes("mood") && <MoodWidget />}
                  {enabledWidgets.includes("journal") && <JournalWidget />}
                  {enabledWidgets.includes("fitness") && <FitnessWidget />}
                  {enabledWidgets.includes("nutrition") && <NutritionWidget />}
                </View>
              </ScrollView>

              <Button
                title="Log Meal"
                onPress={() => handleNavigate("/nurtition")}
              />
              <Button
                title="Settings"
                onPress={() => handleNavigate("/settings")}
              />

              <MoodCalendar />
              <TakeQuizButton
                onPress={() => handleNavigate("/quizzes/screening")}
              />

              <RecommendedWidgetsBanner />

              <View style={styles.card}>
                {/* <Button title="Reset Onboarding" onPress={() => handleNavigate("/utils/resetOnboarding")} /> */}
                {!hasCompletedScreening && (
                  <Button
                    title="Personalise"
                    onPress={() => handleNavigate("/quizzes/screening")}
                  />
                )}
              </View>

              <DeleteButton />
              <LogoutButton />
            </View>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f6f4",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    // textAlign: "center",
    fontFamily: "Patrickhand-regular",
    marginBottom: 20,
  },
  widgets: {
    paddingVertical: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Or "space-between" if you want gaps
    gap: 12, // Optional: adds spacing between cards (for newer RN versions)
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  quote: {
    fontStyle: "italic",
    color: "#555",
  },
  cont: {
    padding: 20,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#397af8",
    marginBottom: 20,
    width: "100%",
    paddingVertical: 15,
  },
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  subheaderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
