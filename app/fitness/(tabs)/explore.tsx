// Cleaned-up FitnessScreen with soft and encouraging tone, truncated results, and "Read More" modal
import React, { useState, useEffect, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image, TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button, Card, Modal, Portal, Provider } from "react-native-paper";

import { useUserPreferences } from "@/context/userPreferences";

import { useCheckInContext } from "@/context/checkInContext";
import TodaysMovementCard from "@/components/Exercise/todaysMovement";

import {
  fetchExerciseData,
  ExerciseProps,
} from "@/utils/api/fetchExerciseData";
import { useRouter } from "expo-router";
import ExerciseHistoryScreen from "@/app/exerciseHistoryScreen";

export default function Explore() {
  const { userPreferences } = useUserPreferences();
  const { moodLabel } = useCheckInContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<ExerciseProps[]>([]);
  const [muscle, setMuscle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseProps | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleHistory, setModalVisibleHistory] = useState(false);

  useEffect(() => {
    const health = userPreferences?.physicalHealth?.toLowerCase();
    const activity = userPreferences?.activityLevel?.toLowerCase();
    const goal = userPreferences?.primaryGoals?.[0]?.toLowerCase() || "";

    if (moodLabel) {
      if (moodLabel === "Having a Tough Day" || moodLabel === "Not My Best") {
        setType("stretching");
        setDifficulty("beginner");
        setReasonText(
          "You indicated you’re really not feeling well today. Here’s a calming stretch to help you reconnect gently. 🧘‍♀️"
        );
      } else if (moodLabel === "Hanging in There") {
        setType("cardio");
        setDifficulty("beginner");
        setReasonText(
          "You indicated you're feeling a bit low. Try this gentle cardio to shake off some of that heaviness and reset. 💜"
        );
      } else if (moodLabel === "Pretty Good") {
        setType("strength");
        setDifficulty("intermediate");
        setReasonText(
          "You indicated you're good today! Here's a steady movement to help lift your mood and build consistency. 🌿"
        );
      } else if (moodLabel === "Feeling Great") {
        setType("strength");
        setDifficulty("expert");
        setReasonText(
          "You're feeling great today! Here's a strong and empowering movement to channel that positive energy. 💪"
        );
      }
    }

    if (health) {
      if (["very poor", "poor"].includes(health)) {
        setDifficulty("beginner");
      } else if (["average", "prefer not to say"].includes(health)) {
        setDifficulty("intermediate");
      } else if (["good", "excellent"].includes(health)) {
        setDifficulty("expert");
      }
    }

    if (goal.includes("strength")) setType("strength");
    else if (goal.includes("flexibility")) setType("stretching");
    else if (goal.includes("energy") || goal.includes("cardio"))
      setType("cardio");
    else if (goal.includes("anxiety")) {
      setType("stretching");
      setDifficulty("beginner");
    }
  }, [moodLabel, userPreferences]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const results = await fetchExerciseData(muscle, type, difficulty);
      setExercises(results);
    } catch (error) {
      console.error("🔥 Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.replace("/dashboard");
  };
  const handleNavigate = (route: Parameters<typeof router.push>[0]): void =>
    router.push(route);

  return (
    <>
      <Provider>
        <ScrollView contentContainerStyle={styles.container}>
          <TodaysMovementCard />
          <Text style={styles.introText}>
            These suggestions are curated just for you based on how you're
            feeling 💜
          </Text>
          <Button
            onPress={fetchExercises}
            style={styles.button}
            textColor="#271949"
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {loading
                  ? "Gathering mindful moves..."
                  : "Show Me Today's suggestions"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color="#271949"
                style={styles.buttonIcon}
              />
            </View>
          </Button>

          {loading && (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          )}

          {exercises.length > 0 && (
            <>
              <TouchableOpacity
                onPress={() => setShowSuggestions(!showSuggestions)}
              >
                <Text style={styles.toggleHeader}>
                  {showSuggestions
                    ? "Hide Suggestions ▲"
                    : "Show Suggestions ▼"}
                </Text>
              </TouchableOpacity>

              {showSuggestions && (
                <>
                  {reasonText ? (
                    <Text style={styles.reasonText}>{reasonText}</Text>
                  ) : null}
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={exercises.slice(0, 5)}
                    style={{ backgroundColor: "#F8F9FA" }}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.resultsContainer}
                    renderItem={({ item }) => (
                      <Card style={styles.card} mode="outlined">
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedExercise(item);
                            setModalVisible(true);
                          }}
                        >
                          <Card.Title
                            title={item.name}
                            subtitle={item.type}
                            titleStyle={{
                              color: "#271949",
                              fontFamily: "PatrickHand-Regular",
                              fontSize: 22,
                            }}
                            subtitleStyle={{
                              color: "#7e5a9b",
                              fontFamily: "Main-font",
                              textTransform: "capitalize",
                            }}
                          />
                          <Card.Content>
                            <Text style={styles.label}>Target Area:</Text>
                            <Text>{item.muscle}</Text>
                            <Text style={styles.label}>Intensity:</Text>
                            <Text>{item.difficulty}</Text>
                            <Text style={styles.label}>Mindful Steps:</Text>
                            <Text style={{ fontSize: 14 }}>
                              {item.instructions.length > 100
                                ? `${item.instructions.slice(0, 100)}...`
                                : item.instructions}
                            </Text>
                            {item.instructions.length > 100 && (
                              <Text style={styles.readMore}>
                                Tap to read more
                              </Text>
                            )}
                          </Card.Content>
                        </TouchableOpacity>
                      </Card>
                    )}
                  />
                </>
              )}
            </>
          )}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/exerciseHistoryScreen")}
            >
              <Image
                source={require("@/assets/images/widgetImages/history.png")}
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>View Exercise History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace("/fitness/(modals)/logExercise")}
            >
              <Image
                source={require("@/assets/images/widgetImages/log.png")} // 🔥 your dumbbell image
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>Log a Movement</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>
            {/* <Card style={styles.exerciseCard} mode="elevated">
              <Card.Content
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row", // 🔥 this is the key change
                  justifyContent: "center",
                }}
              >
                <LottieView
                  source={require("../../../assets/animations/log1.json")}
                  autoPlay
                  loop
                  style={{ width: 150, height: 200, marginLeft: 50 }}
                />
                <View
                  style={{
                    marginLeft: 10,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text style={styles.exerciseText}>Log your movement</Text>
                  <Button
                    // mode="elevated"
                    labelStyle={{ fontSize: 14 }}
                    style={[
                      { width: 150, padding: 0, height: 40 },
                      styles.button,
                    ]}
                    textColor="#271949"
                    compact={true}
                    onPress={() => router.push("/logExercise")}
                  >
                    Start Logging
                  </Button>
                </View>
              </Card.Content>
            </Card> */}
          </View>
        </ScrollView>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modal}
          >
            {selectedExercise && (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.sectionTitle}>{selectedExercise.name}</Text>
                <Text style={styles.label}>Target Area:</Text>
                <Text>{selectedExercise.muscle}</Text>
                <Text style={styles.label}>Intensity:</Text>
                <Text>{selectedExercise.difficulty}</Text>
                <Text style={styles.label}>Steps:</Text>
                <Text>{selectedExercise.instructions}</Text>
                <Button
                  onPress={() => setModalVisible(false)}
                  style={styles.button}
                  textColor="#271949"
                >
                  Close
                </Button>
              </ScrollView>
            )}
          </Modal>
        </Portal>
      </Provider>
    </>
  );
}

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    flexGrow: 1,

  },
  introText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#5D4B8B",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Main-font",
    marginTop: 20,
    width:"100%"
  },
  button: {
    marginVertical: 12,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "#E9DFFF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6d4c8d",
    marginVertical: 12,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  reasonText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#6d4c8d",
    marginVertical: 12,
    textAlign: "center",
    fontFamily: "Main-font",
  },
  resultsContainer: {
    paddingVertical: 20,
    backgroundColor: "#F8F9FA",
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: 280,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#271949",
    fontFamily: "PatrickHand-Regular",
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7e5a9b",
    textTransform: "capitalize",
    fontFamily: "Main-font",
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    color: "#333333",
  },
  readMore: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#9478B5",
    marginTop: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#271949",
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 24,
    height:"70%",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseCard: {
    marginVertical: 20,
    width: width * 0.9,
    backgroundColor: "#F0EBFA",
    borderRadius: 20,
    elevation: 4,
    alignItems: "center",
    padding: 20,
  },
  exerciseText: {
    fontSize: 16,
    fontFamily: "Main-font",
    color: "#5A3E9B",
    textAlign: "center",
  },
  cardsContainer: {
    marginTop: 30,
    alignItems: "center",
    gap: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    // flexWrap: "wrap", 
    justifyContent: "center",
    // paddingHorizontal: 20,
    marginTop: 24,
    gap: 16,
    // height: "100%",
  },

  actionButton: {
    width: "45%", // percentage instead of fixed width
    aspectRatio: 1, 
    marginBottom: 16,
    backgroundColor: "#E9DFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    elevation: 3,
  },
  actionIcon: {
    width: "45%",
    height: "45%",
    // marginRight: 16,
  },

  actionText: {
    fontSize: 18,
    color: "#271949",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    elevation: 3,
    justifyContent: "flex-end",
    fontFamily: "Main-font",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "Main-font",
    color: "#271949",
    marginRight: 8, // small gap between text and icon
  },

  buttonIcon: {
    alignSelf: "center",
  },
});
