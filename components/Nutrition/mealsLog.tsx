import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import dayjs from "dayjs";
import { useUserPreferences } from "@/context/userPreferences";

interface Meal {
  id: string;
  name: string;
  calories: number;
  date: string;
}

const ViewLoggedMeals: React.FC = () => {
  const { userPreferences } = useUserPreferences();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [previousMeals, setPreviousMeals] = useState<Meal[]>([]);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);

  const toggleMealDetails = (id: string) => {
    setExpandedMealId(expandedMealId === id ? null : id);
  };

  useEffect(() => {
    const fetchLoggedMeals = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const today = dayjs().format("YYYY-MM-DD");
        const snapshot = await getDocs(collection(db, "users", uid, "meals"));

        const todayList: Meal[] = [];
        const prevList: Meal[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const docDate = dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD");
          const meal = {
            id: doc.id,
            name: data.description || "Meal",
            calories: data.nutrition?.calories || 0,
            date: docDate,
          };
          if (docDate === today) {
            todayList.push(meal);
          } else {
            prevList.push(meal);
          }
        });

        setMeals(todayList);
        setPreviousMeals(prevList);
      } catch (err) {
        console.error("Failed to fetch logged meals:", err);
      }
    };

    fetchLoggedMeals();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.openButtonText}>View Logged Meals</Text>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Today's Logged Meals</Text>
          <ScrollView>
            {meals.map((meal) => (
              <View key={meal.id} style={styles.mealContainer}>
                <TouchableOpacity
                  onPress={() => toggleMealDetails(meal.id)}
                  style={styles.mealHeader}
                >
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.toggleText}>
                    {expandedMealId === meal.id ? "-" : "+"}
                  </Text>
                </TouchableOpacity>
                {expandedMealId === meal.id && (
                  <View style={styles.mealDetails}>
                    {userPreferences?.calorieViewing && (
                      <Text>Calories: {meal.calories}</Text>
                    )}
                    <Text>Date: {meal.date}</Text>
                  </View>
                )}
              </View>
            ))}

            <Pressable onPress={() => setShowPrevious(!showPrevious)}>
              <Text style={styles.expandToggle}>
                {showPrevious ? "Hide" : "Show"} Previous Logged Meals
              </Text>
            </Pressable>

            {showPrevious &&
              previousMeals.map((meal) => (
                <View key={meal.id} style={styles.mealContainer}>
                  <TouchableOpacity
                    onPress={() => toggleMealDetails(meal.id)}
                    style={styles.mealHeader}
                  >
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.toggleText}>
                      {expandedMealId === meal.id ? "-" : "+"}
                    </Text>
                  </TouchableOpacity>
                  {expandedMealId === meal.id && (
                    <View style={styles.mealDetails}>
                      {userPreferences?.calorieViewing && (
                        <Text>Calories: {meal.calories}</Text>
                      )}
                      <Text>Date: {meal.date}</Text>
                    </View>
                  )}
                </View>
              ))}
          </ScrollView>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#C3B1E1",
    padding: 12,
    borderRadius: 8,
  },
  openButtonText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  mealContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f0f0f0",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealDetails: {
    padding: 12,
    backgroundColor: "#fff",
  },
  expandToggle: {
    textAlign: "center",
    marginVertical: 10,
    color: "#5A67D8",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
  },
  closeText: {
    color: "#390a84",
    fontSize: 16,
  },
});

export default ViewLoggedMeals;
