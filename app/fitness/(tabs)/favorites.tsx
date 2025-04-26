import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  fetchFavoriteExercises,
  deleteFavoriteExercise,
} from "@/utils/saveFavoriteExercises";
import { Card, Button } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const favoritesRef = collection(db, "users", userId, "favorites");

    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const exercises = snapshot.docs.map((doc) => ({
        id: doc.id, // <-- Save the Firestore document id!
        ...doc.data(),
      }));
      setFavorites(exercises);
      setLoading(false);
    });
    

    return () => unsubscribe();
  }, []);
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await fetchFavoriteExercises();
      setFavorites(favs);
    };
  
    fetchFavorites();
  }, []);
  const handleDelete = async (exerciseName: string) => {
    await deleteFavoriteExercise(exerciseName);
  };
  
  
  
  const groupedFavorites = favorites.reduce(
    (groups: Record<string, any[]>, item) => {
      const muscle = item.muscle || "Other";
      if (!groups[muscle]) {
        groups[muscle] = [];
      }
      groups[muscle].push(item);
      return groups;
    },
    {}
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Saved Favorites</Text>

      {loading ? (
        <Text style={styles.loadingText}>Fetching your cute favorites...</Text>
      ) : favorites.length === 0 ? (
        <Text style={styles.emptyText}>
          You haven't saved any favorites yet! 🌸
        </Text>
      ) : (
        <ScrollView style={{ height: height - 100 }}>
          {Object.entries(groupedFavorites).map(([muscle, exercises]) => (
            <View key={muscle} style={styles.categorySection}>
              <Text style={styles.categoryTitle}> {capitalizeFirstLetter(muscle)} </Text>
              {exercises.map((item, index) => (
                <Card
                  style={styles.card}
                  key={`${muscle}-${item.name}-${index}`}
                >
                  <Card.Title
                    title={item.name}
                    subtitle={`Type: ${capitalizeFirstLetter(item.type)}`}
                    titleStyle={styles.cardTitle}
                    subtitleStyle={styles.cardSubtitle}
                    right={() => (
                      <Button
                        onPress={() => handleDelete(item.name)}
                        textColor="#e26a8d"
                      >
                        ❌
                      </Button>
                    )}
                  />
                  <Card.Content
                    style={{ paddingHorizontal: 10, paddingBottom: 10 }}
                  >
                    <Text style={styles.detailText}>
                      💪 Muscle Group: {capitalizeFirstLetter(item.muscle)}
                    </Text>
                    <Text style={styles.detailText}>
                      🎯 Difficulty: {capitalizeFirstLetter(item.difficulty)}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    color: "#5A3E9B",
    fontFamily: "PatrickHand-Regular",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6d4c8d",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    marginBottom: 14,
    backgroundColor: "#FFF7FB",
    borderRadius: 16,
    elevation: 2,
    marginHorizontal: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#271949",
    fontWeight: "700",
    fontFamily: "Main-font",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Main-font",
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#5A3E9B",
    fontFamily: "Main-font",
    textAlign: "left",
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Main-font",
    marginVertical: 2,
  },
});
