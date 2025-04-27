// Redesigned Dashboard Layout with cleaner structure and visual hierarchy
import React, { useRef, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "@/config/firebaseConfig";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  ImageBackground,
} from "react-native";
import { Surface, Button } from "react-native-paper";
import { Divider, useTheme } from "@rneui/themed";
import {
  removeWidget as removeWidgetFromStorage,
  setEnabledWidgets,
  getEnabledWidgets,
  addWidget,
} from "@/utils/widgetStorage";
import {
  isQuizCompletedInFirestore,
  isScreeningQuizCompleted,
} from "@/utils/firestore";

import { useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
dayjs.extend(dayOfYear);
import dayOfYear from "dayjs/plugin/dayOfYear";
import { Link, useFocusEffect } from "expo-router";
import { Header as HeaderRNE, HeaderProps, Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { useMoodContext } from "@/context/moodContext";
import { useUserPreferences } from "@/context/userPreferences";
import { isOnboardingComplete, isQuizComplete } from "@/utils/asyncStorage";
import { auth } from "@/config/firebaseConfig";
import { lightTheme } from "@/config/theme";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetAllAsyncStorage } from "@/utils/asyncStorage";
// Components
import FadeInText from "@/components/fadeInText";
import MoodCalendar from "@/components/moodCalender";
import LogMoodButton from "@/components/Buttons/logMoodBtn";
import LogoutButton from "@/components/Buttons/logoutButton";
import DeleteButton from "@/components/Buttons/deleteAccount";
import TakeQuizButton from "@/components/takeQuiz";
import RecommendedWidgetsBanner from "@/components/recommendedWidegts";
// import NutritionScreen from "../nutrition/combinedNutrition";
import FitnessWidget from "@/components/widgets/FitnessWidget";
import NutritionWidget from "@/components/widgets/NutritionWidget";
// import JournalScreen from "./journal";
import JournalWidget from "@/components/widgets/JournalWidget";
import WaterWidget from "@/components/widgets/WaterWidget";
import MoodWidget from "@/components/widgets/MoodWidget";
import { useEffect } from "react";
import MindfullnessWidget from "@/components/widgets/Mindfullness";
import ThoughtReframeWidget from "@/components/widgets/ThoughtReframeWidget";
import CopingBoxWidget from "@/components/widgets/CopingBoxWidget";
import CBTToolsWidget from "@/components/widgets/CBTToolsWidget";

import CombinedCheckInCard from "../combinedCheckInCard";
import * as ScreenOrientation from "expo-screen-orientation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { fetchAndSendPushNotification } from "@/utils/fetchAndSendPushNotification";
import * as Notifications from "expo-notifications";
import { checkAndScheduleDailyReminder } from "@/utils/checkAndScheduleReminder";
import { getDoc, doc } from "firebase/firestore";
import OuotesBanner from "@/components/quotesBanner";
import { useCheckInContext } from "@/context/checkInContext";

const STORAGE_KEY = "@enabledWidgets";
const dashboardSections = [
  { key: "greeting" },
  { key: "quote" },
  { key: "checkinCard" },
  { key: "logMood" },
  { key: "quiz" },
  { key: "pinnedWidgets" },
  { key: "actions" },
];
const greetings = [
  "Wishing you a calm and kind day 🌸",
  "You are doing better than you think 🌟",
  "Small steps are powerful too 🌿",
  "Your feelings are valid today 💖",
  "Be gentle with yourself today ☀️",
  "You are enough, just as you are 🍃",
  "Sending you strength and warmth 🌼",
];
export default function Dashboard() {
  const router = useRouter();
  const { userPreferences, loading } = useUserPreferences();
  const [crisisModalVisible, setCrisisModalVisible] = useState(false);

  const { hasCheckedInToday, refreshCheckIn } = useCheckInContext();


  const [showTools, setShowTools] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const [enabledWidgets, setEnabledWidgetsState] = useState<string[]>([]);
  const [latestCheckIn, setLatestCheckIn] = useState<null | Record<
    string,
    any
  >>(null);
  const todayIndex = dayjs().dayOfYear() % greetings.length;

  const todaysGreeting = greetings[todayIndex];

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);
  const slideAnim = useRef(new Animated.Value(100)).current; // starts 100px down
  const [hasCompletedScreening, setHasCompletedScreening] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
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
  const handleAddWidget = async (widgetId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    await addWidget(uid, widgetId);
    setWidgetChangeTrigger((prev) => prev + 1); // ✅ triggers re-fetch
  };

  useEffect(() => {
    const cancelAndSchedule = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const userDocRef = doc(db, "users", uid, "preferences", "main");
        const userSnap = await getDoc(userDocRef);
        const data = userSnap.exists() ? userSnap.data() : null;

        let notificationTime: Date;

        if (data?.notificationTime) {
          notificationTime = new Date(data.notificationTime);
        } else {
          // Default to 3PM
          const now = new Date();
          notificationTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            15,
            0,
            0
          );
        }

        await Notifications.cancelAllScheduledNotificationsAsync();
        await checkAndScheduleDailyReminder(notificationTime);
      } catch (err) {
        console.error("🔥 Failed to schedule reminder in dashboard:", err);
      }
    };

    cancelAndSchedule();
  }, []);

  useEffect(() => {
    const checkProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const onboarded = await isOnboardingComplete(); // still fine to use AsyncStorage here
      const quizDone = await isQuizCompletedInFirestore(uid); // now checking Firestore only
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

  const renderToolItems = () =>
    toolsData.map((tool, index) => (
      <View key={index} style={styles.toolItem}>
        <Surface style={styles.surface} elevation={4}>
          <Image style={styles.toolsImage} source={tool.image} />
        </Surface>
        <Text style={styles.toolLabel}>{tool.label}</Text>
      </View>
    ));

  const toolsData = [
    {
      image: require("../../assets/images/widgetImages/rainbow.png"),
      label: "Reflect",
    },
    {
      image: require("../../assets/images/widgetImages/rainbow.png"),
      label: "Reframe",
    },
    {
      image: require("../../assets/images/widgetImages/rainbow.png"),
      label: "Plan",
    },
    {
      image: require("../../assets/images/widgetImages/rainbow.png"),
      label: "Cope",
    },
  ];

  // const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);
  const [widgetChangeTrigger, setWidgetChangeTrigger] = useState(0);

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
  const params = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      const fetchCheckIn = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const today = dayjs().format("YYYY-MM-DD");
        const q = query(
          collection(db, "users", uid, "checkins"),
          where("date", "==", today),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setLatestCheckIn(snapshot.docs[0].data());
        } else {
          setLatestCheckIn(null);
        }
      };

      fetchCheckIn();
    }, [params.refresh])
  );

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
  const removeWidget = async (uid: string, widgetId: string) => {
    if (!uid) return;
    await removeWidgetFromStorage(uid, widgetId);
    setWidgetChangeTrigger((prev) => prev + 1);
  };
  // console.log("🧠 userPreferences from context:", userPreferences);

  if (loading || !userPreferences?.name || !authReady || !auth.currentUser) {
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
      <ImageBackground
        source={require("../../assets/images/dashboard/bg.png")} // your image here
        style={styles.greetingBackground}
        imageStyle={{ borderRadius: 16 }} 
      >


        <SafeAreaView style={styles.headerContainer}>
          <FlatList
            data={dashboardSections}
            style={styles.container}
            bounces={false}
            overScrollMode="never"
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingBottom: 50 }}
            renderItem={({ item }) => {
              switch (item.key) {
                case "greeting":
                  return (
                    <View style={styles.overlay}>
                      <Text style={styles.greetingText}>
                        Hello, {userPreferences.name}!
                      </Text>
                      <Text style={styles.subGreeting}>{todaysGreeting}</Text>
                    </View>
                  );

                case "quote":
                  return (
                    <Animated.View
                      style={{ transform: [{ translateY: slideAnim }] }}
                    >
                      <View style={styles.card}>
                        <OuotesBanner />
                      </View>
                    </Animated.View>
                  );
                case "checkinCard":
                  if (!userPreferences.moodcCheckInBool || !hasCheckedInToday)
                    return null;

                  return (
                    <View style={styles.checkinCard}>
                      <CombinedCheckInCard />
                    </View>
                  );
                case "logMood":
                  if (!userPreferences.moodcCheckInBool || hasCheckedInToday)
                    return null;

                  return (
                    <TouchableOpacity
                      onPress={() => handleNavigate("/checkInScreen")}
                    >
                      <LogMoodButton latestCheckIn={latestCheckIn} />
                    </TouchableOpacity>
                  );

                case "quiz":
                  if (hasCompletedScreening) return null;
                  return (
                    <View style={{width: width, marginBottom: 30 }}>
                      <TakeQuizButton
                        onPress={() => handleNavigate("../quizzes/screening")}
                      />
                    </View>
                  );

                case "pinnedWidgets":
                  const hasNoPinned = enabledWidgets.length === 0;

                  return (
                    <View style={{ marginBottom: 50 }}>
                      {hasNoPinned ? (
                        <>
                          <RecommendedWidgetsBanner
                            triggerRefresh={widgetChangeTrigger}
                            onAddWidget={handleAddWidget}
                          />
                        </>
                      ) : (
                        <>
                          <Text
                            style={[styles.sectionHeader, { marginLeft: 20 }]}
                          >
                            Your Pinned Widgets
                          </Text>
                          <View style={styles.gridContainer}>
                            {enabledWidgets.includes("water") && (
                              <WaterWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "water"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("mood") && (
                              <MoodWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "mood"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("fitness") && (
                              <FitnessWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "fitness"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("nutrition") && (
                              <NutritionWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "nutrition"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("journal") && (
                              <JournalWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "journal"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("mindfulness") && (
                              <MindfullnessWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "mindfulness"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("thoughtReframe") && (
                              <ThoughtReframeWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "thoughtReframe"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("copingBox") && (
                              <CopingBoxWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "copingBox"
                                  )
                                }
                              />
                            )}
                            {enabledWidgets.includes("cbtTools") && (
                              <CBTToolsWidget
                                onRemove={() =>
                                  removeWidget(
                                    auth.currentUser?.uid || "",
                                    "cbtTools"
                                  )
                                }
                              />
                            )}
                          </View>
                        </>
                      )}
                    </View>
                  );

                case "actions":
                  return (
                    <>
                      <DeleteButton />
                      <LogoutButton />
                      <Button onPress={resetAllAsyncStorage}>
                        Reset Async Storage
                      </Button>
                    </>
                  );

                default:
                  return null;
              }
            }}
          />
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    backgroundColor: "transparent",
    height: height,
    margin: 0,
    padding: 0,
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
    color: "#150b01",
  },
  // toolsContainer: {
  //   width: "90%",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 20,
  //   gap: 20,
  // },

  horizontalScroll: {
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 12,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    // textAlign: "center",
    fontFamily: "Patrickhand-regular",
    marginBottom: 20,
    margin: 20,
  },
  widgets: {
    paddingVertical: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 12,
  },
  image: {
    height: 40,
    width: 40,
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    // marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  checkinCard: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  quizContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: "auto",
    margin:0,
    width: width,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Patrickhand-regular",
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 8,
    marginTop: 20,
    paddingLeft: 6,
  },

  quote: {
    fontStyle: "italic",
    color: "#555",
  },
  cont: {
    padding: 20,
  },

  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 20,
    width: width,
    paddingVertical: 15,
    margin: 0,
    padding: 0,
    height: height,
  },
  recommendationCard: {
    backgroundColor: "#f8f0ff",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#865dff",
    marginBottom: 4,
    fontFamily: "Main-font",
  },
  recommendationText: {
    fontSize: 14,
    color: "#444",
    fontFamily: "Main-font",
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
  surface: {
    padding: 4,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginRight: 10,
  },
  divider: {
    width: "100%",
    height: 1.3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 20,
  },
  toolsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  toolItem: {
    flexDirection: "column",
    alignItems: "center",
    width: width * 0.2,
    marginHorizontal: 5,
  },
  toolsImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  toolLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    color: "#444",
    fontFamily: "Main-font",
  },
  sectionToggle: {
    fontSize: 16,
    fontFamily: "PatrickHand-Regular",
    marginLeft: 16,
    marginBottom: 4,
  },
  greetingBackground: {
    height: height,
    resizeMode: "cover",
    justifyContent: "center",
    // paddingHorizontal: 20,
    marginBottom: 20,
    width: width,
    margin: 0,
    padding: 0,
  },

  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 16,
    borderRadius: 16,
  },

  greetingText: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
    color: "#271949",
  },

  subGreeting: {
    fontSize: 16,
    color: "#5a4c7c",
    marginTop: 4,
    fontFamily: "Main-font",
  },
  crisisButton: {
    position: "absolute",
    bottom: 180,
    right: 20,
    backgroundColor: "#ff5c5c",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  crisisButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Main-font",
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
