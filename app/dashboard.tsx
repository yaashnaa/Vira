// Redesigned Dashboard Layout with cleaner structure and visual hierarchy
import React, { useRef, useState, useCallback } from "react";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Button,
  ScrollView,
  Image, Dimensions
} from "react-native";
import { Surface } from "react-native-paper";
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
import NutritionScreen from "./nurtition";
import FitnessWidget from "@/components/widgets/FitnessWidget";
import NutritionWidget from "@/components/widgets/NutritionWidget";
// import JournalScreen from "./journal";
import JournalWidget from "@/components/widgets/JournalWidget";
import WaterWidget from "@/components/widgets/WaterWidget";
import MoodWidget from "@/components/widgets/MoodWidget";
import { useEffect } from "react";
import MindfullnessWidget from "@/components/widgets/Mindfullness";
import ThoughtReframeScreen from "../components/ThoughtReframe/chatbot";
import ReflectionCard from "./reflectionCard";
import CombinedCheckInCard from "./combinedCheckInCard";
const STORAGE_KEY = "@enabledWidgets";
const dashboardSections = [
  { key: "greeting" },
  { key: "quote" },
  { key: "cards" },
  { key: "tools" },
  { key: "logMood" },
  { key: "widgets" },
  { key: "quiz" },
  { key: "recommended" },
  { key: "actions" },
];

export default function Dashboard() {
  const router = useRouter();
  const { userPreferences, loading } = useUserPreferences();
  const { hasLoggedToday } = useMoodContext();
  const [showTools, setShowTools] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const [enabledWidgets, setEnabledWidgetsState] = useState<string[]>([]);
  const [latestCheckIn, setLatestCheckIn] = useState<null | Record<
    string,
    any
  >>(null);

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
    setWidgetChangeTrigger((prev) => prev + 1);
  };

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
      image: require("../assets/images/dashboard/comment_15422558.png"),
      label: "Reflect",
    },
    {
      image: require("../assets/images/dashboard/comment_15422558.png"),
      label: "Reframe",
    },
    {
      image: require("../assets/images/dashboard/comment_15422558.png"),
      label: "Plan",
    },
    {
      image: require("../assets/images/dashboard/comment_15422558.png"),
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

        const q = query(
          collection(db, "users", uid, "checkins"),
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
  console.log("🧠 userPreferences from context:", userPreferences);

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
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb", // soft lilac or any color you want
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity>
            <Icon name="home" type="ionicon" color="#150b01" />
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
              <Icon name="grid" type="feather" color="#150b01" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={() => handleNavigate("/settings")}
            >
              <Icon name="settings" type="feather" color="#150b01" />
            </TouchableOpacity>
          </View>
        }
      />

      <FlatList
        data={dashboardSections}
        style={styles.container}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        renderItem={({ item }) => {
          switch (item.key) {
            case "greeting":
              return (
                <Text style={styles.title}>
                  Hello, {userPreferences.name} 👋
                  <Button
                    onPress={() => handleNavigate("/thoughtReframeScreen")}
                    title="Go to Thoughts"
                  />
                </Text>
              );

            case "quote":
              return (
                <Animated.View
                  style={{ transform: [{ translateY: slideAnim }] }}
                >
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Today's Quote</Text>
                    <Text style={styles.quote}>
                      “Your body is your home — treat it gently.”
                    </Text>
                  </View>
                </Animated.View>
              );
            case "cards":
              return (
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 10 }}
                >
                  <CombinedCheckInCard />

                  {/* <CheckInCard latestCheckIn={latestCheckIn} />
                <ReflectionCard /> */}
                </View>
              );

            case "logMood":
              return (
                <TouchableOpacity
                  onPress={() => handleNavigate("/checkInScreen")}
                >
                  {/* <LogMoodButton latestCheckIn={latestCheckIn} /> */}
                </TouchableOpacity>
              );
            case "tools":
              return (
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => setShowTools((prev) => !prev)}
                  >
                    <Text style={styles.sectionToggle}>
                      🧰 Tools {showTools ? "▲" : "▼"}
                    </Text>
                  </TouchableOpacity>
                  {showTools && (
                    <View style={styles.toolsContainer}>
                      {renderToolItems()}
                    </View>
                  )}
                </View>
              );

            // case "tools":
            //   return (
            //     <View style={styles.toolsContainer}>
            //       <View
            //         style={{ flexDirection: "column", alignItems: "center", width: "15%", flexWrap:'wrap' }}
            //       >
            //         <Surface style={{ ...styles.surface }} elevation={4}>
            //           <Image
            //             style={styles.image}
            //             source={require("../assets/images/dashboard/comment_15422558.png")}
            //           />
            //         </Surface>
            //         <Text>Tools Section</Text>
            //       </View>

            //       <View
            //         style={{ flexDirection: "column", alignItems: "center", width: "15%", flexWrap:'wrap' }}
            //       >
            //         <Surface style={{ ...styles.surface }} elevation={4}>
            //           <Image
            //             style={styles.image}
            //             source={require("../assets/images/dashboard/comment_15422558.png")}
            //           />
            //         </Surface>
            //         <Text>Tools Section</Text>
            //       </View>

            //       <View
            //         style={{ flexDirection: "column", alignItems: "center", width: "15%", flexWrap:'wrap' }}
            //       >
            //         <Surface style={{ ...styles.surface }} elevation={4}>
            //           <Image
            //             style={styles.image}
            //             source={require("../assets/images/dashboard/comment_15422558.png")}
            //           />
            //         </Surface>
            //         <Text>Tools Section</Text>
            //       </View>
            //       <View
            //         style={{ flexDirection: "column", alignItems: "center", width: "15%", flexWrap:'wrap' }}
            //       >
            //         <Surface style={{ ...styles.surface }} elevation={4}>
            //           <Image
            //             style={styles.image}
            //             source={require("../assets/images/dashboard/comment_15422558.png")}
            //           />
            //         </Surface>
            //         <Text>Tools Section</Text>
            //       </View>
            //     </View>
            //   );

            case "widgets":
              return (
                <View style={styles.gridContainer}>
                  {enabledWidgets.includes("water") && (
                    <WaterWidget
                      onRemove={() =>
                        removeWidget(auth.currentUser?.uid || "", "water")
                      }
                    />
                  )}
                  {enabledWidgets.includes("fitness") && (
                    <FitnessWidget
                      onRemove={() =>
                        removeWidget(auth.currentUser?.uid || "", "fitness")
                      }
                    />
                  )}
                  {enabledWidgets.includes("nutrition") && (
                    <NutritionWidget
                      onRemove={() =>
                        removeWidget(auth.currentUser?.uid || "", "nutrition")
                      }
                    />
                  )}
                  {enabledWidgets.includes("mindfulness") && ( // 🔥 fixed spelling
                    <MindfullnessWidget
                      onRemove={() =>
                        removeWidget(auth.currentUser?.uid || "", "mindfulness")
                      }
                    />
                  )}
                  {enabledWidgets.includes("journal") && (
                    <JournalWidget
                      onRemove={() =>
                        removeWidget(auth.currentUser?.uid || "", "journal")
                      }
                    />
                  )}
                  {enabledWidgets.includes("mood") && (
                    <MoodWidget
                      onRemove={() =>
                        removeWidget(auth.currentUser?.uid || "", "mood")
                      }
                    />
                  )}
                </View>
              );
            case "quiz":
              return !hasCompletedScreening ? (
                <>
                  <Divider style={styles.divider} />
                  <TakeQuizButton
                    onPress={() => handleNavigate("/quizzes/screening")}
                  />
                  <Divider style={styles.divider} />
                </>
              ) : null;

            case "recommended":
              return (
                <RecommendedWidgetsBanner
                  onAddWidget={handleAddWidget}
                  triggerRefresh={widgetChangeTrigger}
                />
              );

            case "actions":
              return (
                <>
                  <DeleteButton />
                  <LogoutButton />
                  <Button
                    onPress={resetAllAsyncStorage}
                    title="Reset Async Storage"
                  />
                </>
              );

            default:
              return null;
          }
        }}
      />
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    backgroundColor: "#ffffff",
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
    color: "#150b01",
  },
  // toolsContainer: {
  //   width: "90%",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginBottom: 20,
  //   gap: 20,
  // },
  title: {
    fontSize: 32,
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
    justifyContent: "space-between",
    gap: 12,
  },
  image: {
    height: 40,
    width: 40,
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
  quizContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "auto",
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Patrickhand-regular",
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
  surface: {
    padding: 4,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8edeb",
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
  
});
