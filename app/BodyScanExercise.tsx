import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Header from "@/components/header";
interface BodyScanExerciseProps {
  onBack: () => void;
}

const bodyParts = [
  "Top of Head",
  "Forehead",
  "Eyes",
  "Jaw",
  "Neck and Shoulders",
  "Arms and Hands",
  "Chest",
  "Stomach",
  "Hips",
  "Legs",
  "Feet",
];

export default function BodyScanExercise({ onBack }: BodyScanExerciseProps) {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    animate();
    const interval = setInterval(() => {
      setCurrentPartIndex((prev) => (prev + 1) % bodyParts.length);
      animate();
    }, 5000); // 5 seconds per part

    return () => clearInterval(interval);
  }, []);

  const animate = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Header title="Body Scan" />
      <View style={styles.container}>
        {/* Expandable Section */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setExpanded((prev) => !prev)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.expandButtonText}>
              {expanded ? "Hide Info" : "What is Body Scanning?"}
            </Text>
            <AntDesign
              name={expanded ? "up" : "down"}
              size={20}
              color="#5A3E9B"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.infoText}>
              Body scanning is a mindfulness practice that involves paying
              attention to different parts of your body with gentle awareness.
              It can help reduce stress, improve focus, and connect you with how
              you’re feeling physically and emotionally. 🌿
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                Linking.openURL(
                  "https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=TR3431&ContentTypeID=1"
                )
              }
            >
              <Text style={styles.linkText}>
                Learn more from University of Rochester Medical Center
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{alignSelf: "center", marginTop: expanded ? 20 : 60 }}>
          <Text style={styles.title}>Body Scan</Text>
          <Text style={styles.instruction}>Focus gently on your...</Text>
          {/* Animated Current Body Part */}
          <Animated.View style={{ opacity: fadeAnim, marginTop: 30 }}>
            <Text style={styles.bodyPart}>{bodyParts[currentPartIndex]}</Text>
          </Animated.View>

          <Text style={styles.helperText}>
            Notice any sensations — warmth, tingling, relaxation. No need to
            change anything — just observe. 🌼
          </Text>

          {/* Video Resource */}
          <TouchableOpacity
            style={styles.videoButton}
            onPress={() =>
              Linking.openURL("https://www.youtube.com/watch?v=QS2yDmWk0vs")
            }
          >
            <Text style={styles.videoButtonText}>
              🎥 Watch a Guided Body Scan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5FF",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#E4DFFD",
    padding: 8,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#5A3E9B",
    fontSize: 16,
    fontWeight: "bold",
  },
  expandButton: {
    marginTop: 40,
    backgroundColor: "#E4DFFD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  expandButtonText: {
    color: "#5A3E9B",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  expandedContent: {
    marginTop: 10,
    backgroundColor: "#faf7ff",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
  },
  linkText: {
    color: "#5A67D8",
    textDecorationLine: "underline",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  title: {
    fontSize: 32,
    fontFamily: "PatrickHand-Regular",
    color: "#5A3E9B",
    marginBottom: 10,
    textAlign: "center",
  },
  instruction: {
    fontSize: 20,
    color: "#5A3E9B",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  bodyPart: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#865DFF",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "PatrickHand-Regular",
  },
  helperText: {
    marginTop: 40,
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
    textAlign: "center",
    fontFamily: "Comfortaa-Regular",
  },
  videoButton: {
    marginTop: 40,
    backgroundColor: "#A084DC",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  videoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
  },
});
