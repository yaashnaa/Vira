import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Card, Divider, IconButton } from "react-native-paper";

const faqData = [
  {
    question: "Is Vira a fitness tracker?",
    answer:
      "Nope! Vira is a gentle wellness companion focused on your emotional well-being. It doesn’t track weight, calories, or workouts.",
  },
  {
    question: "Will I lose progress if I skip a few days?",
    answer:
      "Absolutely not. Vira has no streaks, penalties, or guilt. You can return any time — we’re always here when you're ready.",
  },
  {
    question: "Can I use this app if I have a history of disordered eating?",
    answer:
      "Yes. Vira was intentionally designed to avoid triggering patterns. You’re always in control of what you see and track.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Your reflections are stored securely and only visible to you. You can choose whether or not to sync data to the cloud.",
  },
  {
    question: "Why doesn’t the app show calories or macros by default?",
    answer:
      "We believe your well-being is more than numbers. Vira focuses on how you feel — not what you measure. But if you need nutritional info, you can opt-in gently.",
  },
  {
    question: "What if I don’t know how I’m feeling?",
    answer:
      "That’s okay. Vira offers gentle prompts, emotion wheels, and journal nudges to help you explore and name what’s going on — no pressure to have all the answers.",
  },
  {
    question: "How do I customize the app for my needs?",
    answer:
      "Go to Settings → Preferences. You can personalize tone, reminders, goals, and what kind of content you want to see. You’re in charge.",
  },
  {
    question: "Can I use Vira during a mental health crisis?",
    answer:
      "Vira isn’t a replacement for professional care. But it includes a crisis plan section and emergency links. If you're in distress, please reach out for immediate support.",
  },
];

export default function FaqScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const router = useRouter();
  const toggleCard = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
          <HeaderRNE
        containerStyle={{ backgroundColor: "#f8edeb", borderBottomWidth: 0 }}
        leftComponent={
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" type="ionicon" color="#190028" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "FAQ",
          style: {
            color: "#271949",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "PatrickHand-Regular",
          },
        }}
      />

      <ScrollView style={styles.container}>
      <Text style={styles.header}>Frequently Asked Questions</Text>
      {faqData.map((item, index) => (
        <Card key={index} mode="elevated" style={styles.card} onPress={() => toggleCard(index)}>
          <Card.Title
            title={item.question}
            titleStyle={styles.title}
            titleNumberOfLines={0} // Allow title to wrap to multiple lines
            right={(props) => (
              <IconButton
            {...props}
            icon={expandedIndex === index ? "chevron-up" : "chevron-down"}
              />
            )}
          />
          {expandedIndex === index && (
            <>
              <Divider />
              <Card.Content>
            <Text style={styles.answer}>{item.answer}</Text>
              </Card.Content>
            </>
          )}
        </Card>
      ))}
    </ScrollView>
    </>
  
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 28,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fef6fb",
    marginBottom: 18,
    borderRadius: 12,
    elevation: 2,
    padding:14,
  },
  title: {
    fontFamily: "Main-font",
    fontSize: 17,
    color: "#3e2a6e",
    flexWrap: "wrap",
  },
  answer: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: "Main-font",
    color: "#5e4a7d",
    lineHeight: 20,
  },
});
