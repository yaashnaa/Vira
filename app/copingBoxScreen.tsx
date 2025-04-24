import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Linking,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import { auth, db } from "@/config/firebaseConfig";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import CrisisPlanSection from "@/components/crisisPlanSection";
import { useRouter } from "expo-router";
import Header from "@/components/header";
const copingCategories = [
  {
    key: "selfSoothing",
    title: "Self-Soothing",
    icon: require("@/assets/images/coping/5.png"),
    explanation:
      "Use your five senses to bring comfort. Think warm drinks, calming sounds, soft textures, or cozy smells.",
    suggestions: [
      "☕ Hold a warm mug of tea or cocoa",
      "🎶 Listen to calming nature sounds",
      "🧣 Wrap yourself in a soft blanket",
      "🕯️ Light a candle with your favorite scent",
      "🛁 Take a warm showe r or bath",
      "🌸 Smell something comforting like lavender",
    ],
    resourceLink: "https://www.youtube.com/watch?v=W19PdslW7iw", // Soothing sounds
  },
  {
    key: "distraction",
    title: "Distraction",
    icon: require("@/assets/images/coping/7.png"),
    explanation:
      "Gently redirect your attention away from distress by doing something creative, playful, or mentally engaging.",
    suggestions: [
      "🧩 Do a puzzle or word game",
      "🎨 Doodle, paint, or color something",
      "📺 Watch a comforting or funny video",
      "📚 Read a light book or comic",
      "🎮 Play a simple mobile game",
      "📸 Look through old photos",
    ],
    resourceLink: "https://www.youtube.com/watch?v=VLVdjLbXdm4", // Calming drawing video
  },
  {
    key: "oppositeAction",
    title: "Opposite Action",
    icon: require("@/assets/images/coping/8.png"),
    explanation:
      "Do the opposite of what your difficult emotion is telling you — this helps shift your emotional state with intention.",
    suggestions: [
      "💬 Read or write a positive affirmation",
      "😂 Watch a funny or silly video",
      "🎶 Listen to upbeat or feel-good music",
      "🚶 Take a quick walk or stretch",
      "💃 Put on a song and dance around",
      "😊 Smile in the mirror for 30 seconds",
    ],
    resourceLink: "https://www.youtube.com/watch?v=EcLNPpHJuS0", // Funny video
  },
  {
    key: "emotionalAwareness",
    title: "Emotional Awareness",
    icon: require("@/assets/images/coping/9.png"),
    explanation:
      "Name what you're feeling, give it space, and express it safely — this helps reduce overwhelm.",
    suggestions: [
      "📝 Free-write in your journal for 5 minutes",
      "🎭 Draw or paint how you feel right now",
      "🎯 Use an emotion wheel to name your feeling",
      "🗣️ Say out loud: 'I feel… and that’s okay'",
      "📈 Rate your emotion on a 1–10 scale",
      "📖 Read a quote that reflects your mood",
    ],
    resourceLink: "https://www.youtube.com/watch?v=ZxfJicfyCdg", // Emotional check-in tool
  },
  {
    key: "mindfulness",
    title: "Mindfulness",
    icon: require("@/assets/images/coping/6.png"),
    explanation:
      "Slow down, return to the present moment, and reconnect with your breath, body, and surroundings.",
    suggestions: [
      "🌬️ Try the 4-7-8 breathing technique",
      "👀 Name 3 things you see, 3 you hear",
      "🕯️ Gaze softly at a candle flame",
      "🧘 Do a 1-minute body scan",
      "🍇 Eat something slowly and mindfully",
      "🌳 Sit outside and observe nature",
    ],
    resourceLink: "https://www.youtube.com/watch?v=inpok4MKVLM", // 5-minute mindfulness meditation
  },
  {
    key: "affirmations",
    title: "Affirmations & Self-Talk",
    icon: require("@/assets/images/coping/10.png"), // Pick a soothing icon
    explanation:
      "Gentle reminders or words of encouragement can shift your mindset. Let these phrases ground and support you.",
    suggestions: [
      "🌱 'I’m doing the best I can right now'",
      "💗 'It’s okay to feel what I’m feeling'",
      "🌞 'This feeling is temporary'",
      "🌊 'I can ride this wave'",
      "🫶 'I’m allowed to rest and take space'",
      "💬 Write your own kind statement",
    ],
    resourceLink: "https://www.youtube.com/watch?v=Q_EpCmS_JDg", // Affirmation audio
  },
];

export default function CopingSuggestionsScreen() {
  const router = useRouter();
  const [currentTip, setCurrentTip] = useState<{
    tip: string;
    category: string;
  } | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const uid = auth.currentUser?.uid;

  const getRef = (categoryKey: string) =>
    doc(db, "users", uid!, "copingData", "box");

  const generateRandomTip = () => {
    const allTips = copingCategories.flatMap((cat) =>
      cat.suggestions.map((tip) => ({ tip, category: cat.key }))
    );
    const random = allTips[Math.floor(Math.random() * allTips.length)];
    setCurrentTip(random);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const handleBackPress = () => {
    router.back();
  };

  const saveToBox = async (category: string, tip: string) => {
    if (!uid || !tip) return;
    const ref = getRef(category);
    await setDoc(
      ref,
      {
        [category]: arrayUnion(tip),
      },
      { merge: true }
    );
  };

  return (
    <>
      <Header title="Explore Coping Strategies" />

      <ScrollView style={styles.container}>
        {/* <Text style={styles.header}>Explore Coping Strategies</Text> */}

        <View style={styles.tipCard}>
          <Button mode="contained" icon="shuffle" onPress={generateRandomTip}>
            Generate a Random Tip
          </Button>

          {currentTip && (
            <Animated.View style={{ opacity: fadeAnim, marginTop: 12 }}>
              <Card style={styles.randomTipCard}>
                <Card.Content>
                  <Text style={styles.tip}>{currentTip.tip}</Text>
                  <Text style={styles.description}>
                    Category:{" "}
                    {
                      copingCategories.find(
                        (c) => c.key === currentTip.category
                      )?.title
                    }
                  </Text>
                  {/* {copingCategories.find((c) => c.key === currentTip.category)
              ?.resourceLink && (
              <Button
                icon="play-circle"
                mode="text"
                onPress={() =>
                  Linking.openURL(
                    copingCategories.find(
                      (c) => c.key === currentTip.category
                    )?.resourceLink!
                  )
                }
                textColor="#865dff"
                style={{ marginTop: 8 }}
              >
                Learn More
              </Button>
            )} */}
                  {/* <Button
              icon="plus"
              mode="outlined"
              onPress={() =>
                saveToBox(currentTip.category, currentTip.tip)
              }
              style={{ marginTop: 8 }}
            >
              Add to My Box
            </Button> */}
                </Card.Content>
              </Card>
            </Animated.View>
          )}
        </View>

        {copingCategories.map((cat) => (
          <View key={cat.key} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <Image source={cat.icon} style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{cat.title}</Text>
                <Text style={styles.description}>{cat.explanation}</Text>
              </View>
            </View>

            {cat.resourceLink && (
              <Button
                icon="play-circle"
                mode="text"
                onPress={() => Linking.openURL(cat.resourceLink!)}
                textColor="#865dff"
                style={{ marginBottom: 8 }}
              >
                Try this resource
              </Button>
            )}

            <Divider style={styles.divider} />
          </View>
        ))}

        {/* <Card style={styles.resourceHubCard}>
    <Card.Content>
      <Text style={styles.title}>More Resources</Text>
      <Button
        icon="file-download"
        mode="text"
        onPress={() =>
          Linking.openURL("https://feelingswheel.com/FeelingsWheel.pdf")
        }
        textColor="#865dff"
      >
        Download Emotion Wheel PDF
      </Button>
      <Button
        mode="text"
        icon="open-in-new"
        onPress={() =>
          Linking.openURL("https://www.mentalhealthamerica.net")
        }
        textColor="#865dff"
      >
        Mental Health America
      </Button>
      <Button
        mode="text"
        icon="open-in-new"
        onPress={() => Linking.openURL("https://insighttimer.com")}
        textColor="#865dff"
      >
        Insight Timer – Free meditations
      </Button>
    </Card.Content>
  </Card> */}

        {/* <Divider style={styles.divider} /> */}
        <CrisisPlanSection />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff0f6",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 24,
    textAlign: "center",
  },
  randomTipCard: {
    backgroundColor: "#fbeaff", // light lilac
    borderRadius: 16,
    elevation: 2,
    padding: 12,
    marginTop: 12,
  },
  resourceHubCard: {
    backgroundColor: "#f0f8ff", // light blue
    borderRadius: 16,
    elevation: 2,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PatrickHand-Regular",
    color: "#d33",
    marginTop: 32,
    marginBottom: 8,
    textAlign: "center",
  },
  categoryCard: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  icon: {
    width: 80,
    height: 70,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
  },
  description: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#5e4a7d",
    marginTop: 4,
  },
  tipCard: {
    marginBottom: 32,
  },
  tip: {
    fontSize: 16,
    fontFamily: "Main-font",
    color: "#3e2a6e",
    textAlign: "left",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 20,
  },
});
