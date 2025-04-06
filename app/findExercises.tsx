import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Card, Chip } from "react-native-paper";
import { useMoodContext } from "@/context/moodContext";
import { useUserPreferences } from "@/context/userPreferences";
import { fetchExerciseData, ExerciseProps } from "@/utils/api/fetchExerciseData";
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

  const muscleOptions = [
    "abdominals",
    "biceps",
    "chest",
    "glutes",
    "hamstrings",
    "lats",
    "lower_back",
    "middle_back",
    "quadriceps",
    "triceps",
  ];

  const typeOptions = [
    "cardio",
    "strength",
    "stretching",
    "powerlifting",
    "plyometrics",
  ];

  const difficultyOptions = ["beginner", "intermediate", "expert"];

  useEffect(() => {
    if (mood !== null) {
      if (mood >= 75) {
        setType("stretching");
        setDifficulty("beginner");
      } else if (mood >= 50) {
        setType("strength");
        setDifficulty("intermediate");
      } else {
        setType("cardio");
        setDifficulty("intermediate");
      }
    }

    const health = userPreferences?.physicalHealth?.toLowerCase();
    if (health) {
      if (["very poor", "poor"].includes(health)) {
        setDifficulty("beginner");
      } else if (["average", "prefer not to say"].includes(health)) {
        setDifficulty("intermediate");
      } else if (["good", "excellent"].includes(health)) {
        setDifficulty("expert");
      }
    }

    const goal = userPreferences.primaryGoals?.[0]?.toLowerCase() || "";
    const activity = userPreferences.activityLevel?.toLowerCase() || "";

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
  }, [mood, userPreferences]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const results = await fetchExerciseData(muscle, type, difficulty);
      setExercises(results);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    router.replace("/fitness");
  };

  return (
    <>
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
            text: "FIND EXERCISES",
            style: {
              color: "#271949",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: "PatrickHand-Regular",
            },
          }}
        />
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.filterLabel}>Muscle Group</Text>
      <View style={styles.chipContainer}>
        {muscleOptions.map((item) => (
          <Chip
            key={item}
            mode="outlined"
            selected={muscle === item}
            onPress={() => setMuscle(muscle === item ? "" : item)}
            style={styles.chip}
            textStyle={[styles.chipText, { textTransform: "capitalize" }]}
            selectedColor="#000000"
            showSelectedOverlay={true}
 
          >
            {item}
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
            showSelectedOverlay={true}
            textStyle={[styles.chipText, { textTransform: "capitalize" }]}
          >
            {item}
          </Chip>
        ))}
      </View>

      <Text style={{ fontStyle: "italic", color: "#666", marginBottom: 10 }}>
        Based on your physical health, we've suggested {difficulty} exercises.
      </Text>

      <Text style={styles.filterLabel}>Difficulty</Text>
      <View style={styles.chipContainer}>
        {difficultyOptions.map((item) => (
          <Chip
            key={item}
            mode="outlined"
            style={styles.chip}
            selected={difficulty === item}
            onPress={() => setDifficulty(difficulty === item ? "" : item)}
            textStyle={[styles.chipText, { textTransform: "capitalize" }]}
            selectedColor="#000000"
            showSelectedOverlay={true}
        
          >
            {item}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={fetchExercises}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </Button>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.resultsContainer}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.type} />
            <Card.Content>
              <Text style={styles.label}>Muscle:</Text>
              <Text>{item.muscle}</Text>
              <Text style={styles.label}>Difficulty:</Text>
              <Text>{item.difficulty}</Text>
              <Text style={styles.label}>Instructions:</Text>
              <Text>{item.instructions}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </ScrollView>
    </>

  );
}

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
  card: {
    marginRight: 16,
    width: 300,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  label: {
    fontWeight: "600",
    marginTop: 8,
    fontFamily: "Main-font",
  },
});
