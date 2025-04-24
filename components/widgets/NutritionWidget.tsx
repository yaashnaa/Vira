import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import WidgetCard from "../widgetCard";
import { Icon } from "@rneui/themed";
import { Pressable, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import dayjs from "dayjs";

interface NutritionWidgetProps {
  onRemove?: () => void;
}

const NutritionWidget: React.FC<NutritionWidgetProps> = ({ onRemove }) => {
  const router = useRouter();
  const [mealsLogged, setMealsLogged] = useState(0);
  const [topMeal, setTopMeal] = useState<string | null>(null);

  const handlePress = () => {
    router.replace("/nurtition");
  };

  const fetchMeals = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const snapshot = await getDocs(collection(db, "users", uid, "meals"));
      const meals = snapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as { description?: string; timestamp?: { seconds: number } }) }))
        .sort((a, b) => {
          const aTime = a.timestamp?.seconds || 0;
          const bTime = b.timestamp?.seconds || 0;
          return bTime - aTime; // Newest first
        });

      setMealsLogged(meals.length);
      if (meals.length > 0) {
        const latestMeal = meals[0];
        const formattedTime = latestMeal.timestamp?.seconds
          ? dayjs.unix(latestMeal.timestamp.seconds).format("h:mm A")
          : null;
        setTopMeal(`${latestMeal.description} at ${formattedTime}`);
      }
      
    } catch (error) {
      console.error("🔥 Error fetching meals from Firestore:", error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <View style={styles.container}>
      {onRemove && (
        <Pressable onPress={onRemove} style={styles.removeIcon}>
          <Icon name="minus-circle" type="feather" color="#c13e6a" size={20} />
        </Pressable>
      )}
      <WidgetCard
        title="Nutrition"
        
        imageSource={require("../../assets/images/widgetImages/diet.png")}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  removeIcon: {
    position: "absolute",
    top: 18,
    left: 100,
    zIndex: 1,
  },
});

export default NutritionWidget;
