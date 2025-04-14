// screens/ExerciseHistoryScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { fetchExerciseLogs } from "@/utils/saveExerciseLog";
import { auth, db } from "@/config/firebaseConfig";
import dayjs from "dayjs";
import { deleteDoc, doc } from "firebase/firestore";
import { IconButton } from "react-native-paper";
import { Alert } from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
export default function ExerciseHistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleBackPress = () => {
    router.replace("/fitness");
  };

  const handleDelete = async (logId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "exerciseLogs", logId));
      setLogs((prev) => prev.filter((log) => log.id !== logId));
    } catch (err) {
      console.error("🔥 Error deleting exercise log:", err);
    }
  };
  useEffect(() => {
    const loadLogs = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const data = await fetchExerciseLogs(user.uid);
      setLogs(data);
      setLoading(false);
    };

    loadLogs();
  }, []);

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
            <Icon name="arrow-back" size={25} type="ionicon" color="#271949" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "EXERCISE LOGS",
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
              onPress={() => router.replace("/settings")}
            >
              <Icon name="settings" size={25} type="feather" color="#271949" />
            </TouchableOpacity>
          </View>
        }
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Exercise Logs</Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : logs.length === 0 ? (
            <Text>No logs yet</Text>
          ) : (
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.desc}>🏋️ {item.description}</Text>
                    <IconButton
                      icon="delete"
                      size={18}
                      onPress={() =>
                        Alert.alert(
                          "Delete Log",
                          "Are you sure you want to delete this entry?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => handleDelete(item.id),
                            },
                          ]
                        )
                      }
                    />
                  </View>
                  {item.moodAfter !== undefined && (
                    <Text style={styles.mood}>
                      Mood after: {item.moodAfter}/100
                    </Text>
                  )}
                  <Text style={styles.date}>
                    {dayjs(item.timestamp.toDate()).format(
                      "MMM D, YYYY h:mm A"
                    )}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    marginBottom: 16,
    color: "#271949",
  },
  card: {
    backgroundColor: "#F5F0FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    fontFamily: "Main-font",
  },
  mood: {
    fontSize: 14,
    color: "#6B46C1",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
});
