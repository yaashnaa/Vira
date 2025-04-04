import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
  Alert, Dimensions
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth, db } from "@/config/firebaseConfig";
import dayjs from "dayjs";
import { useUserPreferences } from "@/context/userPreferences";
import { getMealInsights } from "@/utils/getMealInsights";
import { Button } from "react-native-paper";

interface Meal {
  id: string;
  name: string;
  calories: number;
  date: string;
  nutrition?: {
    [key: string]: any;
  };
}

export async function getTodayMealsLogged(): Promise<string[]> {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  const snapshot = await getDocs(collection(db, "users", uid, "meals"));
  const today = dayjs().format("YYYY-MM-DD");
  const mealTypes: string[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const docDate = dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD");
    if (docDate === today && data.mealType) {
      mealTypes.push(data.mealType.toLowerCase());
    }
  });

  return mealTypes;
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

  const deleteMeal = async (mealId: string) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      await deleteDoc(doc(db, "users", uid, "meals", mealId));
      setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
      setPreviousMeals((prev) => prev.filter((meal) => meal.id !== mealId));
      Alert.alert("Meal deleted successfully");
    } catch (err) {
      console.error("Failed to delete meal:", err);
      Alert.alert("Error deleting meal");
    }
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
            nutrition: data.nutrition || {},
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
    <SafeAreaView>
      <View style={styles.wrapper}>
        <View>
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
                    <View style={styles.controlButtons}>
                      <Text style={styles.toggleText}>
                        {expandedMealId === meal.id ? "-" : "+"}
                      </Text>
                      <Button
                        onPress={() => deleteMeal(meal.id)}
                     
                      >
                        <AntDesign name="delete" size={20} color="black" />
                      </Button>
                    </View>
                  </TouchableOpacity>
                  {expandedMealId === meal.id && (
                    <View style={styles.mealDetails}>
                      {userPreferences?.macroViewing === false &&
                        userPreferences?.calorieViewing === false && (
                          <Text>
                            {getMealInsights(meal.nutrition)
                              .map((i) => `🌟 This meal is ${i}.`)
                              .join("\n")}
                          </Text>
                        )}

                      {userPreferences?.calorieViewing && (
                        <Text>Calories: {meal.calories}</Text>
                      )}
                      <Text>Date: {meal.date}</Text>
                      <Button
                        mode="outlined"
                        onPress={() => deleteMeal(meal.id)}
                        style={{ marginTop: 10 }}
                      >
                        <AntDesign name="delete" size={24} color="black" />
                      </Button>
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
                        <Button
                          mode="outlined"
                          onPress={() => deleteMeal(meal.id)}
                          style={{ marginTop: 10 }}
                        >
                          Delete
                        </Button>
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
        </View>
      </View>
    </SafeAreaView>
  );
};
const screenWidth= Dimensions.get('window')

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    alignItems: "center",
  },
  controlButtons:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    padding: 0,
    
    // margin: "auto",
    // gap: 10,
  },
  openButton: {
    backgroundColor: "#C3B1E1",
    padding: 12,
    borderRadius: 8,
    fontFamily: "PatrickHand-regular",
  },
  openButtonText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "PatrickHand-regular",
  },
  mealContainer: {
    marginBottom: 12,
    borderWidth: 1,
    width: "100%",
    borderColor: "#E7D2CF",
    borderRadius: 8,
    overflow: "hidden",
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 12,
    paddingLeft:10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f6dfdb",
  },
  mealName: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Comfortaa-regular",
  },
  toggleText: {
    fontSize: 18,
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
