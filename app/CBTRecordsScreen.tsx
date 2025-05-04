import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { Card, Divider, Button } from "react-native-paper";
import { collection, getDocs, orderBy, query, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import Header from "@/components/header";
import dayjs from "dayjs";

export default function ViewCBTRecordsScreen() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedRecord, setEditedRecord] = useState<any>({});

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "users", uid, "cbtThoughtRecords"),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRecords(data);
    setLoading(false);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setEditedRecord(record);
  };

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid || !editingId) return;

      await updateDoc(doc(db, "users", uid, "cbtThoughtRecords", editingId), editedRecord);
      setEditingId(null);
      setEditedRecord({});
      fetchRecords();
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert("Error", "Could not update the record. Try again.");
    }
  };

  const handleDelete = (recordId: string) => {
    Alert.alert("Delete Record", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            await deleteDoc(doc(db, "users", uid, "cbtThoughtRecords", recordId));
            fetchRecords();

          } catch (error) {
            console.error("Error deleting record:", error);
            Alert.alert("Error", "Could not delete the record.");
          }
        },
      },
    ]);
  };

  return (
    <>
      <Header title="My Thought Records" backPath="/CBTToolsScreen" />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#622f00" />
        ) : records.length === 0 ? (
          <Text style={styles.emptyText}>No thought records found.</Text>
        ) : (
          records.map((record) => {
            const isEditing = editingId === record.id;
            const ts = record.timestamp?.toDate?.() || new Date();

            return (
              <Card key={record.id} style={styles.card}>
                <Card.Title
                  title={dayjs(ts).format("MMMM D, YYYY")}
                  titleStyle={styles.cardTitle}
                  subtitle={dayjs(ts).format("h:mm A")}
                  subtitleStyle={styles.cardSubtitle}
                />
                <Card.Content>
                  {["situation", "thoughts", "emotions", "distortions", "response", "outcome"].map((field) => (
                    <View key={field}>
                      <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</Text>
                      {isEditing ? (
                        <TextInput
                          style={styles.input}
                          value={editedRecord[field]}
                          multiline
                          onChangeText={(text) => setEditedRecord((prev: any) => ({ ...prev, [field]: text }))}
                        />
                      ) : (
                        <Text style={styles.content}>{record[field]}</Text>
                      )}
                      <Divider style={styles.divider} />
                    </View>
                  ))}

                  {isEditing ? (
                    <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                      Save
                    </Button>
                  ) : (
                    <View style={styles.actions}>
                      <Button
                        mode="text"
                        onPress={() => handleEdit(record)}
                        textColor="#4b2b82"
                      >
                        Edit
                      </Button>
                      <Button
                        mode="text"
                        onPress={() => handleDelete(record.id)}
                        textColor="#b92626"
                      >
                        Delete
                      </Button>
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff8f0",
    minHeight: "100%",
  },
  card: {
    backgroundColor: "#fefefe",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardTitle: {
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    fontSize: 20,
  },
  cardSubtitle: {
    fontFamily: "Main-font",
    color: "#777",
    fontSize: 14,
  },
  label: {
    fontFamily: "Main-font",
    fontWeight: "600",
    color: "#271949",
    marginTop: 10,
  },
  content: {
    fontFamily: "Main-font",
    color: "#444",
    marginBottom: 4,
  },
  divider: {
    marginVertical: 6,
  },
  emptyText: {
    fontFamily: "Main-font",
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontFamily: "Main-font",
    marginBottom: 4,
    minHeight: 40,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: "#885291",
  },
});
