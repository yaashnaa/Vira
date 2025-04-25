import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Modal, Portal, Button, Card } from "react-native-paper";
import { useCheckInContext } from "@/context/checkInContext";

const tipsByCheckIn = {
  mood: {
    "Having a Tough Day": "🍌 Try a banana with nut butter — rich in B6 and mood-boosting carbs.",
    "Not My Best": "🍫 A small piece of dark chocolate may give a gentle mood lift.",
    "Hanging in There": "🥣 Oats are comforting and help stabilize mood swings.",
    "Pretty Good": "🥗 Celebrate your balance with a colorful, fresh veggie bowl.",
    "Feeling Great": "🍉 Refresh with hydrating fruits like watermelon and berries.",
  },
  energy: {
    "Running on Empty": "🥔 Add complex carbs like sweet potatoes to stabilize energy.",
    "A Little Tired": "🍵 Green tea offers a gentle energy boost without the crash.",
    "Doing Alright": "🥜 Snack on nuts for a steady release of energy.",
    "Feeling Energized": "🍳 Enjoy a balanced meal with protein, fats, and carbs to fuel your day.",
    "Ready to Take on the Day": "🍓 Boost your start with antioxidant-rich berries!",
  },
  sleep: {
    "Really Struggled": "🥣 Oatmeal with warm milk supports melatonin and relaxation.",
    "Not the Best": "🫖 Herbal teas like chamomile can help with better rest tonight.",
    "Okay Sleep": "🍊 Vitamin C from oranges may gently boost tired mornings.",
    "Pretty Restful": "🍯 Honey with tea can support continued sleep quality.",
    "Slept Like a Baby": "🍒 Cherries naturally contain melatonin for restful sleep.",
  },
};

export default function NutritionTipsModal({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const { moodLabel, energyLabel, sleepLabel } = useCheckInContext() as {
    moodLabel: keyof typeof tipsByCheckIn.mood | null;
    energyLabel: keyof typeof tipsByCheckIn.energy | null;
    sleepLabel: keyof typeof tipsByCheckIn.sleep | null;
  };

  // Pick tip based on priority: Mood > Energy > Sleep
  const selectedTip =
    (moodLabel && tipsByCheckIn.mood[moodLabel]) ||
    (energyLabel && tipsByCheckIn.energy[energyLabel]) ||
    (sleepLabel && tipsByCheckIn.sleep[sleepLabel]) ||
    "💛 Gentle reminder: You deserve nourishment every day.";

  return (
    <Card style={styles.card} mode="contained">
      <Card.Content>
        <Text style={styles.title}>Today's Nutrition Tip 🌱</Text>
        <Text style={styles.tipText}>{selectedTip}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
    card: {
    //   marginVertical: 10,
      backgroundColor: "#fbeaff",
      borderRadius: 16,
      padding: 10,
      elevation: 3,
    },
    title: {
      fontSize: 19,
      fontFamily: "PatrickHand-Regular",
      color: "#5c3d89",
      marginBottom: 8,
    },
    tipText: {
      fontSize: 16,
      fontFamily: "Main-font",
      color: "#5f4c6b",
    },
  });
