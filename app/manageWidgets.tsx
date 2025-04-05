import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Card, Switch, Button, Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Header as HeaderRNE, HeaderProps, Icon } from "@rneui/themed";
const STORAGE_KEY = "@enabledWidgets";

const availableWidgets = [
  { id: "mood", label: "Mood Tracker" },
  { id: "nutrition", label: "Nutrition" },
  { id: "fitness", label: "Fitness" },
  { id: "journal", label: "Journal" },
  { id: "water", label: "Water Intake" },
  { id: "mindfulness", label: "Mindfulness" },
];

export default function ManageWidgetsScreen() {
  const router = useRouter();
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);

  useEffect(() => {
    const fetchWidgets = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEnabledWidgets(JSON.parse(stored));
      }
    };
    fetchWidgets();
  }, []);

  const toggleWidget = (widgetId: string) => {
    setEnabledWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const saveChanges = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(enabledWidgets));
      console.log("🧩 Enabled Widgets Saved:", enabledWidgets);
      router.replace("/dashboard");
    } catch (e) {
      console.error("Failed to save widgets:", e);
    }
  };
  const handleBackPress = () => {
    router.replace("/dashboard");
  };

  return (
    <>
 <HeaderRNE
        containerStyle={{
          backgroundColor: "#D7C4EB", // soft lilac or any color you want
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
      <Text style={styles.title}>Manage Dashboard Widgets</Text>
      {availableWidgets.map((widget) => (
        <Card key={widget.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{widget.label}</Text>
            <Switch
              value={enabledWidgets.includes(widget.id)}
              onValueChange={() => toggleWidget(widget.id)}
              color="#C3B1E1"
            />
          </View>
        </Card>
      ))}
      <Button
        mode="contained"
        onPress={saveChanges}
        style={styles.saveButton}
        buttonColor="#C3B1E1"
        textColor="black"
      >
        Save Changes
      </Button>
    </ScrollView>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Patrickhand-regular",
  },
  card: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontFamily: "Comfortaa-Regular",
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 6,
    borderRadius: 10,
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
  },
});
