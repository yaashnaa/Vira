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
} from "react-native";
import LottieView from "lottie-react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { Button, Card, Modal, Portal, Provider } from "react-native-paper";
import { useMoodContext } from "@/context/moodContext";
import { useUserPreferences } from "@/context/userPreferences";
import LogExercise from "@/app/logExercise";
import TodaysMovementCard from "@/components/Exercise/todaysMovement";
// import FitnessScreen from "./findExercises";
import {
  fetchExerciseData,
  ExerciseProps,
} from "@/utils/api/fetchExerciseData";
import { useRouter } from "expo-router";


export default function FitnessScreen() {
  const { userPreferences } = useUserPreferences();
  const { mood } = useMoodContext();
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

  useEffect(() => {
    const health = userPreferences?.physicalHealth?.toLowerCase();
    const activity = userPreferences?.activityLevel?.toLowerCase();
    const goal = userPreferences?.primaryGoals?.[0]?.toLowerCase() || "";
    console.log(mood)
    if (mood !== null) {
      if (mood >= 75) {
        setType("stretching");
        setDifficulty("beginner");
        setReasonText(
          "You indicated you’re really not feeling well today. Here’s a calming stretch to help you reconnect gently. 🧘‍♀️"
        );
       
      } else if (mood >= 50) {
        setType("cardio");
        setDifficulty("beginner");
        setReasonText(
          "You indicated you're feeling a bit low. Try this gentle cardio to shake off some of that heaviness and reset. 💜"
        );
        setType("strength");
        setDifficulty("intermediate");
        setReasonText(
          "You indicated you're feeling okay today. Here's a steady movement to help lift your mood and build consistency. 🌿"
        );
      } else if (mood >= 25) {
        setType("strength");
        setDifficulty("intermediate");
        setReasonText(
          "You indicated you're feeling okay today. Here's a steady movement to help lift your mood and build consistency. 🌿"
        );
      } else {
        setType("strength");
        setDifficulty("expert");
        setReasonText(
          "You're indicated you're feeling great today! Here's a strong and empowering movement to channel that positive energy. 💪"
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
  }, [mood, userPreferences]);

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
        <HeaderRNE
          containerStyle={{
            backgroundColor: "#f8edeb",
            borderBottomWidth: 0,
            paddingTop: 10,
          }}
          leftComponent={
            <TouchableOpacity onPress={handleBackPress}>
              <Icon
                name="arrow-back"
                size={25}
                type="ionicon"
                color="#271949"
              />
            </TouchableOpacity>
          }
          centerComponent={{
            text: "MOVEMENT",
            style: {
              color: "#271949",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "PatrickHand-Regular",
            },
          }}
          rightComponent={
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => handleNavigate("/settings")}>
                <Icon name="settings" type="feather" color="#150b01" />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.introText}>
            Let's move! These suggestions are curated just for you based on how
            you're feeling 💜
          </Text>

          <Button
            // mode="outlined"
            onPress={fetchExercises}
            style={styles.button}
            textColor="#271949"
            disabled={loading}
          >
            {loading
              ? "Gathering mindful moves..."
              : "Show Me Today's suggestions"}
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
                    data={exercises.slice(0, 2)}
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
          <Button
            icon={"dumbbell"}
            onPress={() => router.replace("/exerciseHistoryScreen")}
            textColor="#230d00"
          >
            {" "}
            View exercise history
          </Button>
          <TodaysMovementCard />
          <View style={styles.cardsContainer}>
            <Card style={styles.exerciseCard} mode="elevated">
              <Card.Content
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row", // 🔥 this is the key change
                  justifyContent: "center",
                }}
              >
                <LottieView
                  source={require("../assets/animations/log1.json")}
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
            </Card>

            <Card style={styles.exerciseCard} mode="elevated">
              <Card.Content
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <LottieView
                  source={require("../assets/animations/find1.json")}
                  autoPlay
                  loop
                  style={{ width: 150, height: 200, marginLeft: 10 }}
                />
                <View
                  style={{
                    marginLeft: 10,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text style={styles.exerciseText}>
                    Want to explore more mindful movement suggestions?
                  </Text>
                  <Button
                    mode="elevated"
                    compact={true}
                    labelStyle={{ fontSize: 14 }}
                    textColor="#271949"
                    style={[{ width: 150 }, styles.button]}
                    onPress={() => router.push("/findExercises")}
                  >
                    Explore More
                  </Button>
                </View>
              </Card.Content>
            </Card>
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
    color: "black",
  },
  exerciseCard: {
    margin: 20,
    height: 200,
    width: width * 0.9,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    elevation: 3,
  },

  exerciseText: {
    fontSize: 14,
    color: "#080316",
    fontFamily: "Main-font",
    // textAlign: "center",
    marginVertical: 10,
    width: width * 0.6,
  },

  introText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
    color: "#555",
    fontFamily: "Main-font",
  },
  cardTitle: {
    color: "#271949",
  },
  button: {
    marginVertical: 10,
    fontSize: 14,
    padding: 0,
    backgroundColor: "#ddceff",
    color: "#020106",
  },
  cardsContainer: {
    display: "flex",
    // bottom: 120,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#271949",
    fontFamily: "Comfortaa-Regular",
  },
  resultsContainer: {
    paddingVertical: 10,
    backgroundColor: "#F8F9FA",
  },
  card: {
    marginRight: 16,
    // marginTop: 10,
    width: 300,
    borderRadius: 12,
    color: "black",
    backgroundColor: "#ffffff",
  },
  label: {
    fontWeight: "bold",

    marginTop: 8,
    fontSize: 15,
    fontFamily: "Comfortaa-Regular",
    color: "black",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    height: height * 0.7,
  },
  readMore: {
    color: "#6d4c8d",
    fontStyle: "italic",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  reasonText: {
    fontSize: 15,
    fontStyle: "italic",
    // marginVertical: 10,
    color: "#6d4c8d",
    fontFamily: "Main-font",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  toggleHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5b429d",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
});
