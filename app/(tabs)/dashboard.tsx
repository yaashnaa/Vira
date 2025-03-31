// app/(tabs)/home.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { lightTheme } from "@/config/theme";
import { resetOnboarding } from "../../utils/resetOnboarding";
import LogoutButton from "@/components/logoutButton";
import FadeInText from "@/components/fadeInText";
import AddWidgetButton from "@/components/addWidgets";
import BasicButton from "@/components/basicButton";
import Quotes from "../quotes";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { UserPreferences, useUserPreferences } from "@/context/userPreferences";
export default function Dashboard() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;
  const { userPreferences } = useUserPreferences();
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

  const handleLogMood = () => {
    // Navigate to the mood logging screen or daily check-in
    router.push("/");
  };

  const handleStartWorkout = () => {
    // Navigate to the fitness/workout screen
    router.push("/fitness");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FadeInText style={styles.title}>
          Welcome back, {userPreferences?.name}!
        </FadeInText>
        <View style={styles.snapshotContainer}>
          <Text style={styles.snapshotTitle}>Today's Quote</Text>
          <Text>Qoute will be here </Text>
          {/* <Quotes /> */}
        </View>
        <BasicButton onPress={handleQuizPress} style={{ width: 240}}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="pencil-square-o" size={24} color="black" />
            <Text> Personalise the app</Text>
          </View>
        </BasicButton>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AddWidgetButton />
        </View>
        {/* <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogMeal}>
            <Text style={styles.buttonText}>Log Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogMood}>
            <Text style={styles.buttonText}>Log Mood</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleStartWorkout}
          >
            <Text style={styles.buttonText}>Log Workout</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>Today's Recommendation</Text>
          <Text style={styles.recommendationText}>
            Try our gentle yoga routine for a refreshing start!
          </Text>
        </View>
        <View style={styles.container}>
          <Button title="Reset Onboarding" onPress={resetOnboarding} />
          <Button title="Personalise" onPress={handlePersonalize} />
          <LogoutButton />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
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
