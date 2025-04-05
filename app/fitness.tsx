import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Header as HeaderRNE, HeaderProps, Icon } from "@rneui/themed";
import { Button, Card, Chip } from "react-native-paper";
import { useMoodContext } from "@/context/moodContext";
import { useUserPreferences } from "@/context/userPreferences";
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
  const handleBackPress = () => {
    router.replace("/dashboard");
  };

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
      console.error("🔥 Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  function handleNav(){
    router.push("./findExercises");
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
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#5A3E9B" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "NUTRITION",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{ marginLeft: 12 }}
              onPress={handleBackPress}
            >
              <Icon name="settings" size={25} type="feather" color="#5A3E9B" />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.container}>
        {mood !== null && (
          <Text
            style={{ fontStyle: "italic", marginBottom: 10, color: "#666" }}
          >
            Suggestions based on how you're feeling today 💜
          </Text>
        )}

        <Button
          mode="contained"
          onPress={fetchExercises}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Loading..." : "See Exercises"}
        </Button>

        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}

        {exercises.length > 0 && (
          <>
            <Text style={styles.filterLabel}>Today's Suggestions</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={exercises.slice(0, 2)}
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
            <Button
              mode="outlined"
              style={styles.button}
              onPress={() =>
                router.push("./c")
              }
            >
              Find More Exercises
            </Button>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F9FA",
    color: "black",
  },
  filterLabel: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    fontFamily: "Comfortaa-regular",
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
    color: "black",
    backgroundColor: "#ffffff",
  },
  label: {
    fontWeight: "600",
    marginTop: 8,
    fontSize: 16,
    fontFamily: "Comfortaa-regular",
    color: "black",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
});
