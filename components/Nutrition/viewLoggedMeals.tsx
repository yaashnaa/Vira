import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import dayjs from "dayjs";
import { useUserPreferences } from "@/context/userPreferences";
import { useMealLog } from "@/context/mealLogContext";
import Toast from "react-native-toast-message";

interface Meal {
  id: string;
  name: string;
  calories: number;
  date: string;
  mood?: string;
  nutrition?: {
    [key: string]: any;
  };
}

const ViewLoggedMeals: React.FC = () => {
  const { userPreferences } = useUserPreferences();
  const { refreshFlag, triggerRefresh } = useMealLog();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [previousMeals, setPreviousMeals] = useState<Meal[]>([]);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [previousModalVisible, setPreviousModalVisible] = useState(false);

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

      triggerRefresh();

      Toast.show({
        type: "success",
        text1: "Meal deleted!",
        text2: "Your meal has been removed from the log.",
        position: "bottom",
      });
    } catch (err) {
      console.error("Error deleting meal:", err);
      Toast.show({
        type: "error",
        text1: "Error deleting meal",
        text2: "Please try again later.",
        position: "bottom",
      });
    }
  };

  const fetchLoggedMeals = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const today = dayjs().format("YYYY-MM-DD");
      const snapshot = await getDocs(collection(db, "users", uid, "meals"));

      const todayList: Meal[] = [];
      const prevList: Meal[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docDate = dayjs(data.timestamp?.toDate()).format("YYYY-MM-DD");
        const meal = {
          id: docSnap.id,
          name: data.description,
          calories: data.nutrition?.calories || 0,
          date: docDate,
          mood: data.mood,
          nutrition: data.nutrition || {},
        };
        if (docDate === today) {
          todayList.push(meal);
        } else {
          prevList.push(meal);
        }
      });
      setMeals(
        todayList
          .filter((meal) => meal && meal.name)
          .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
      );

      const sortedPrevious = prevList
        .filter((meal) => meal && meal.name)
        .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
      setPreviousMeals(sortedPrevious);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  useEffect(() => {
    fetchLoggedMeals();
  }, [refreshFlag]);

  return (
    <>
      <Text style={styles.sectionTitle}>🍽️ Today's Meals</Text>

      {meals.length === 0 ? (
        <Text style={styles.emptyText}>You haven’t logged any meals yet.</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleMealDetails(item.id)}
              style={styles.mealCard}
            >
              <View>
                <Text style={styles.mealName}>
                  {item.name || "Unnamed Meal"}
                </Text>
                {userPreferences.calorieViewing ||
                userPreferences.macroViewing ? (
                  <Text style={styles.mealDetail}>
                    {userPreferences.calorieViewing && (
                      <>
                        {item.nutrition?.calories || 0} cal{" "}
                        {userPreferences.macroViewing && " | "}
                      </>
                    )}
                    {userPreferences.macroViewing && (
                      <>
                        {item.nutrition?.protein || 0}g protein |{" "}
                        {item.nutrition?.carbs || 0}g carbs |{" "}
                        {item.nutrition?.fat || 0}g fat
                      </>
                    )}
                  </Text>
                ) : (
                  <Text style={styles.mealDetail}>🌟 Balanced Meal!</Text>
                )}

                {item.mood && (
                  <Text style={styles.mealMood}>Mood: {item.mood}</Text>
                )}
              </View>
              {expandedMealId === item.id && (
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Delete Meal", "Are you sure?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteMeal(item.id),
                      },
                    ])
                  }
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {previousMeals.length > 0 && (
        <Pressable
          onPress={() => setPreviousModalVisible(true)}
          style={styles.showPreviousButton}
        >
          <Text style={styles.showPreviousText}>Show Previous Meals</Text>
        </Pressable>
      )}

      <Modal
        visible={previousModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPreviousModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ padding: 20 }}>
            <Text style={styles.sectionTitle}>📅 Previous Meals</Text>

            {previousMeals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDetail}>
                  {meal.nutrition?.calories || 0} cal |{" "}
                  {meal.nutrition?.protein || 0}g protein |{" "}
                  {meal.nutrition?.carbs || 0}g carbs |{" "}
                  {meal.nutrition?.fat || 0}g fat
                </Text>
                <Text style={styles.dateText}>Logged on {meal.date}</Text>
              </View>
            ))}

            <Pressable
              onPress={() => setPreviousModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default ViewLoggedMeals;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
    marginBottom: 12,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  mealCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    // width: "80%",
  },
  mealName: {
    fontSize: 16,
    fontFamily: "Main-font",
    fontWeight: "bold",
    marginBottom: 4,
  },
  mealDetail: {
    fontSize: 13,
    color: "#555",
  },
  mealMood: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#e57373",
    padding: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  showPreviousButton: {
    backgroundColor: "#A084DC",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  showPreviousText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  dateText: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
