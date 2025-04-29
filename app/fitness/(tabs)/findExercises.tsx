import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Button,
  Card,
  Chip,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useUserPreferences } from "@/context/userPreferences";
import { useCheckInContext } from "@/context/checkInContext"; // ✅ Now clean

import {
  fetchExerciseData,
  ExerciseProps,
} from "@/utils/api/fetchExerciseData";
import {
  fetchFavoriteExercises,
  deleteFavoriteExercise,
  saveFavoriteExercise,
} from "@/utils/saveFavoriteExercises";

export const screenOptions = {
  animation: "slide_from_right",
};

export default function FitnessScreen() {
  const { userPreferences } = useUserPreferences();
  const { moodNumeric } = useCheckInContext(); // ✅ Using moodNumeric now
  const router = useRouter();

  const [selectedExercise, setSelectedExercise] = useState<ExerciseProps | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<ExerciseProps[]>([]);
  const [muscle, setMuscle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [favorites, setFavorites] = useState<ExerciseProps[]>([]);

  const formatLabel = (text: string) =>
    text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const muscleOptions = [
    "abdominals", "biceps", "chest", "glutes",
    "hamstrings", "lats", "lower_back", "middle_back",
    "quadriceps", "triceps",
  ];

  const typeOptions = [
    "cardio", "strength", "stretching", "powerlifting", "plyometrics",
  ];

  const difficultyOptions = ["beginner", "intermediate", "expert"];

  const loadFavoriteNamesFromFirestore = async () => {
    const favorites = await fetchFavoriteExercises();
    setFavorites(favorites);
  };

  useEffect(() => {
    loadFavoriteNamesFromFirestore();
  }, []);

  useEffect(() => {
    // Mood Based Settings
    if (moodNumeric !== null) {
      if (moodNumeric >= 75) {
        setType("stretching");
        setDifficulty("beginner");
      } else if (moodNumeric >= 50) {
        setType("strength");
        setDifficulty("intermediate");
      } else {
        setType("cardio");
        setDifficulty("intermediate");
      }
    }

    // User Preferences Settings
    const health = userPreferences?.physicalHealth?.toLowerCase();
    const goal = userPreferences.primaryGoals?.[0]?.toLowerCase() || "";
    const activity = userPreferences.activityLevel?.toLowerCase() || "";

    if (health) {
      if (["very poor", "poor"].includes(health)) {
        setDifficulty("beginner");
      } else if (["average", "prefer not to say"].includes(health)) {
        setDifficulty("intermediate");
      } else if (["good", "excellent"].includes(health)) {
        setDifficulty("expert");
      }
    }

    if (goal.includes("strength")) {
      setType("strength");
    } else if (goal.includes("flexibility")) {
      setType("stretching");
    } else if (goal.includes("energy") || goal.includes("cardio")) {
      setType("cardio");
    } else if (goal.includes("anxiety")) {
      setType("stretching");
      setDifficulty("beginner");
    } else if (goal.includes("general")) {
      setType("cardio");
      setDifficulty("intermediate");
    }

    if (activity.includes("sedentary")) {
      setDifficulty("beginner");
    } else if (activity.includes("lightly")) {
      setDifficulty((prev) => prev || "intermediate");
    } else if (activity.includes("very")) {
      setDifficulty("expert");
    }
  }, [moodNumeric, userPreferences]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const isMuscleRelevant = !["cardio", "stretching"].includes(type);
      const selectedMuscle = isMuscleRelevant ? muscle : "";

      const results = await fetchExerciseData(selectedMuscle, type, difficulty);
      setExercises(results);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (exerciseName: string) => {
    const exerciseId = exerciseName.replace(/\s+/g, "_").toLowerCase();
    return favorites.some((fav) => fav.id === exerciseId);
  };

  const toggleFavorite = async (exercise: ExerciseProps) => {
    const exerciseId = exercise.name.replace(/\s+/g, "_").toLowerCase();
    if (isFavorite(exercise.name)) {
      await deleteFavoriteExercise(exercise.name);
      Toast.show({ type: "info", text1: "Removed from Favorites 💔", position: "bottom" });
      setFavorites((prev) => prev.filter((fav) => fav.id !== exerciseId));
    } else {
      await saveFavoriteExercise(exercise);
      Toast.show({ type: "success", text1: "Added to Favorites ❤️", position: "bottom" });
      setFavorites((prev) => [...prev, { id: exerciseId, ...exercise }]);
    }
  };

  const handleNavigate = (route: Parameters<typeof router.push>[0]) => router.push(route);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Filters */}
      <Text style={styles.filterLabel}>Muscle Group</Text>
      <View style={styles.chipContainer}>
        {muscleOptions.map((item) => (
          <Chip
            key={item}
            mode="outlined"
            selected={muscle === item}
            disabled={["cardio", "stretching"].includes(type)}
            onPress={() => setMuscle(muscle === item ? "" : item)}
            style={[styles.chip, ["cardio", "stretching"].includes(type) && styles.chipDisabled]}
            textStyle={styles.chipText}
            selectedColor="#000000"
          >
            {formatLabel(item)}
          </Chip>
        ))}
      </View>

      <Text style={styles.filterLabel}>Type</Text>
      <View style={styles.chipContainer}>
        {typeOptions.map((item) => (
          <Chip
            key={item}
            mode="outlined"
            selected={type === item}
            onPress={() => setType(type === item ? "" : item)}
            style={styles.chip}
            selectedColor="#000000"
            textStyle={styles.chipText}
          >
            {item}
          </Chip>
        ))}
      </View>

      <Text style={styles.filterLabel}>Difficulty</Text>
      <View style={styles.chipContainer}>
        {difficultyOptions.map((item) => (
          <Chip
            key={item}
            mode="outlined"
            selected={difficulty === item}
            onPress={() => setDifficulty(difficulty === item ? "" : item)}
            style={styles.chip}
            selectedColor="#000000"
            textStyle={styles.chipText}
          >
            {formatLabel(item)}
          </Chip>
        ))}
      </View>

      <Button mode="contained" onPress={fetchExercises} style={styles.button} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </Button>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Exercise Cards */}
      <Provider>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={exercises}
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
                  subtitle={formatLabel(item.type)}
                  titleStyle={styles.cardTitle}
                  subtitleStyle={styles.cardSubtitle}
                  right={(props) => (
                    <TouchableOpacity
                      {...props}
                      onPress={() => toggleFavorite(item)}
                      style={{ marginRight: 10 }}
                    >
                      <MaterialCommunityIcons
                        name={isFavorite(item.name) ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite(item.name) ? "#ff6b81" : "#aaa"}
                      />
                    </TouchableOpacity>
                  )}
                />
                <Card.Content>
                  <Text style={styles.label}>Muscle:</Text>
                  <Text>{formatLabel(item.muscle)}</Text>
                  <Text style={styles.label}>Difficulty:</Text>
                  <Text>{formatLabel(item.difficulty)}</Text>
                  <Text style={styles.label}>Instructions:</Text>
                  <Text>{item.instructions.length > 100 ? `${item.instructions.slice(0, 100)}...` : item.instructions}</Text>
                  {item.instructions.length > 100 && (
                    <Text style={styles.readMore}>Tap to read more</Text>
                  )}
                </Card.Content>
              </TouchableOpacity>
            </Card>
          )}
        />

        {/* Exercise Modal */}
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            {selectedExercise && (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={styles.sectionTitle}>{selectedExercise.name}</Text>
                <Text style={styles.label}>Muscle:</Text>
                <Text>{formatLabel(selectedExercise.muscle)}</Text>
                <Text style={styles.label}>Difficulty:</Text>
                <Text>{formatLabel(selectedExercise.difficulty)}</Text>
                <Text style={styles.label}>Full Instructions:</Text>
                <Text>{selectedExercise.instructions}</Text>
                <Button onPress={() => { toggleFavorite(selectedExercise); setModalVisible(false); }} style={styles.button}>
                  Save to Favorites
                </Button>
                <Button onPress={() => setModalVisible(false)} style={styles.button} textColor="#271949">
                  Close
                </Button>
              </ScrollView>
            )}
          </Modal>
        </Portal>
      </Provider>
    </ScrollView>
  );
}

const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    fontFamily: "Main-font",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    margin: 4,
    backgroundColor: "#ffffff",
  },
  chipText: {
    fontFamily: "Main-font",
    fontWeight: "600",
    fontSize: 12,
    color: "#0e0524",
  },
  button: {
    marginVertical: 16,
    backgroundColor: "#f4cac4",
  },
  resultsContainer: {
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },

  label: {
    fontWeight: "600",
    marginTop: 8,
    fontFamily: "Main-font",
  },
  card: {
    marginRight: 16,
    width: 300,
    height: 320, // fixed height
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  readMore: {
    color: "#6d4c8d",
    fontStyle: "italic",
    marginTop: 10,
    fontSize: 14,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    maxWidth: 400,
    height: height * 0.3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#271949",
    fontFamily: "Comfortaa-Regular",
  },
  instructions: {
    fontSize: 14,
    marginTop: 5,
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
  chipDisabled: {
    opacity: 0.3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#271949",
    fontFamily: "Main-font",
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#271949",
    fontFamily: "Main-font",
  },
});
