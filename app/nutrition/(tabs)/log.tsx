import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Button,
  RadioButton,
  IconButton,

} from "react-native-paper";
import { useRouter } from "expo-router";
import { logMealToFirestore } from "@/utils/firestore";

import { fetchNutritionData } from "@/utils/api/fetchNutritionData";
import { auth } from "@/config/firebaseConfig";
import { useMealLog } from "@/context/mealLogContext";
import Toast from "react-native-toast-message";
const mealOptions = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Prefer not to specify",
];

const moodOptions = [
  {
    label: "Uncomfortable",
    image: require("../../../assets/images/foodMood/vnothappy.png"),
  },
  {
    label: "Still Hungry",
    image: require("../../../assets/images/foodMood/nothappy.png"),
  },
  {
    label: "Content",
    image: require("../../../assets/images/foodMood/neutral.png"),
  },
  {
    label: "Satisfied",
    image: require("../../../assets/images/foodMood/satisfied.png"),
  },
  {
    label: "Nourished",
    image: require("../../../assets/images/foodMood/vsatisfied.png"),
  },
];

interface LogMealCardModalProps {
  onLog?: (data: { nutrition: any; mood: string; name: string }) => void;
}

export default function LogMealCardModal({ onLog }: LogMealCardModalProps) {

  const [mealTypeError, setMealTypeError] = useState(false);
  const [mealDescription, setMealDescription] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [satisfaction, setSatisfaction] = useState(3);
  const [mood, setMood] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const { triggerRefresh } = useMealLog();
  const [loading, setLoading] = useState(false);


  const handleLogMeal = async () => {
    if (!mealDescription.trim()) {
      setDescriptionError(true);
      return;
    }
    if (!mealType || !mealOptions.includes(mealType)) {
      setMealTypeError(true);
      return;
    }

    setDescriptionError(false);
    setMealTypeError(false);
    setLoading(true);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("No user logged in");

      const nutrition = await fetchNutritionData(mealDescription);

      // 🛑 Validate API response
      const hasValidData =
        nutrition &&
        (nutrition.calories ||
          nutrition.protein ||
          nutrition.carbs ||
          nutrition.fat);

      if (!hasValidData) {
        alert(
          "We couldn’t recognize that food. Please try a more specific or real meal description."
        );
        setLoading(false);
        return;
      }


      await logMealToFirestore(uid, {
        description: mealDescription,
        mood,
        type: mealType,
        satisfaction,
        nutrition,
        calories: nutrition.calories ?? 0,
        protein: nutrition.protein ?? 0,
        carbs: nutrition.carbs ?? 0,
        fat: nutrition.fat ?? 0,
      });

      onLog?.({ nutrition, mood, name: mealDescription });
      triggerRefresh();

      Toast.show({
        type: "success",
        text1: "Meal logged! 🍽️",
        text2: "Your meal has been successfully logged.",
        position: "bottom",
      });
      resetForm();
    } catch (err) {
      console.error("❌ Error logging meal:", err);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Failed to save your meal log",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMealDescription("");
    setMealType("Breakfast");
    setSatisfaction(3);
    setMood("");
    setImageUri(null);
  };

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>🍽️ Log a Meal</Text>

      <TextInput
        style={[styles.input, descriptionError && styles.errorInput]}
        value={mealDescription}
        onChangeText={(text) => {
          setMealDescription(text);
          if (text.trim()) setDescriptionError(false);
        }}
        placeholder="e.g., '1 cup pasta with tomato sauce' "
      />
      {descriptionError && (
        <Text style={styles.errorText}>Please describe your meal.</Text>
      )}
      {mealTypeError && (
        <Text style={styles.errorText}>Food not found, try again. </Text>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Meal Type</Text>
        <RadioButton.Group onValueChange={setMealType} value={mealType}>
          {mealOptions.map((type) => (
            <View key={type} style={styles.radioRow}>
              <RadioButton value={type} />
              <Text>{type}</Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Fullness Rating (1–5)</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <IconButton
              key={n}
              iconColor="#A084DC"
              icon={n <= satisfaction ? "circle" : "circle-outline"}
              onPress={() => setSatisfaction(n)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mood after eating</Text>
        <View style={styles.ratingRow}>
          {moodOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setMood(option.label)}
              style={
                mood === option.label ? styles.selectedMood : styles.moodOption
              }
            >
              <Image source={option.image} style={styles.moodImage} />
            </TouchableOpacity>
          ))}
        </View>
        {mood && <Text style={styles.selectedMoodLabel}>{mood}</Text>}
      </View>
      {/* 
          <View style={styles.section}>
            <Text style={styles.label}>Upload an Image</Text>
            <Button mode="outlined" onPress={pickImage}>
              Choose from Gallery
            </Button>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
          </View> */}

      <Button mode="contained" loading={loading} onPress={handleLogMeal}>
        Save Meal
      </Button>
    </View>
  );
}
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    height: height * 0.8,
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  selectedMoodLabel: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Main-font",
    // fontWeight: "600",
    color: "#555",
    textAlign: "center",

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodOption: {
    padding: 8,
  },
  selectedMood: {
    padding: 8,
    borderWidth: 2,
    borderColor: "#A084DC",
    borderRadius: 8,
  },
  emoji: {
    fontSize: 28,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  moodImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
  },
});
