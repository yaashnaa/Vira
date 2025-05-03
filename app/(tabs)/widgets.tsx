// app/tools/index.tsx

import React, {  useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Card, IconButton, Modal, Portal, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { auth } from "@/config/firebaseConfig";
import { useFocusEffect } from "expo-router";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  addWidget,
  removeWidget as removeWidgetFromStorage,
  getEnabledWidgets,
} from "@/utils/widgetStorage";
import CrisisQuickView from "@/components/crisisQuickView";

const tools = [
  {
    category: "🧠 Thought Tools",
    items: [
      {
        id: "thoughtReframe",
        label: "Thought Reframe",
        route: "/thoughtReframeScreen",
        icon: require("../../assets/images/widgetImages/rainbow.png"),
        description:
          "Challenge unhelpful thoughts and reframe them constructively.",
      },
      {
        id: "cbtTools",
        label: "CBT Thought Record",
        route: "/CBTToolsScreen",
        icon: require("../../assets/images/widgetImages/notebook.png"),
        description:
          "Track automatic thoughts and explore cognitive distortions.",
      },
    ],
  },
  {
    category: "📓 Reflection & Journaling",
    items: [
      {
        id: "journal",
        label: "Reflection Journal",
        route: "/journal",
        icon: require("../../assets/images/widgetImages/reflection.png"),
        description: "Write freely or with prompts to reflect on your day.",
      },
    ],
  },
  {
    category: "💖 Coping & Comfort",
    items: [
      {
        id: "copingBox",
        label: "Coping Box",
        route: "/copingBoxScreen",
        icon: require("../../assets/images/widgetImages/heart.png"),
        description:
          "Access a personalized collection of comfort tools and ideas.",
      },
      {
        id: "mindfulness",
        label: "Mindfulness",
        route: "/mindfulness",
        icon: require("../../assets/images/widgetImages/yoga.png"),
        description: "Breathe, pause, and reset with simple mindful exercises.",
      },
      {
        id: "crisisHelp", // 🆘 NEW TOOL
        label: "Get Immediate Help",
        route: "modalCrisisHelp", // handled specially
        icon: require("../../assets/images/widgetImages/sos.png"), // create a small life ring or SOS image
        description: "Access crisis resources and emergency contacts anytime.",
      },
    ],
  },
  {
    category: "🔍 Tracking Tools",
    items: [
      {
        id: "mood",
        label: "Insights",
        route: "/mood",
        icon: require("../../assets/images/widgetImages/mood.png"),
        description:
          "Discover patterns in how you feel and grow with awareness.",
      },
      {
        id: "fitness",
        label: "Fitness Tracker",
        route: "/fitness",
        icon: require("../../assets/images/widgetImages/triangle.png"),
        description: "Explore gentle, energy-based exercise suggestions.",
      },
      {
        id: "nutrition",
        label: "Nutrition Tracker",
        route: "/nutrition",
        icon: require("../../assets/images/widgetImages/diet.png"),
        description: "Log meals, view insights, and reflect on how food feels.",
      },
      {
        id: "water",
        label: "Water Tracker",
        route: "/waterTracker",
        icon: require("../../assets/images/widgetImages/water.png"),
        description: "Track hydration without pressure. Just gentle reminders.",
      },
    ],
  },
];

export default function ToolsScreen() {
    useEffect(() => {
      const enforceAgreement = async () => {
        const user = auth.currentUser;
        if (!user) return;
    
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || !userDoc.data().agreedToTerms) {
          router.replace("/termsOfUse");
        }
      };
    
      enforceAgreement();
    }, []);
    
  const router = useRouter();
  const [pinned, setPinned] = useState<string[]>([]);
  const [crisisModalVisible, setCrisisModalVisible] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const fetchPinned = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const result = await getEnabledWidgets(uid);
        setPinned(result);
      };
      fetchPinned();
    }, [])
  );
  const togglePin = async (id: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    if (pinned.includes(id)) {
      await removeWidgetFromStorage(uid, id);
      setPinned((prev) => prev.filter((p) => p !== id));
    } else {
      await addWidget(uid, id);
      setPinned((prev) => [...prev, id]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tools.map((section, i) => (
        <View key={i}>
          <Text style={styles.sectionTitle}>{section.category}</Text>
          {section.items.map((tool, j) => (
            <TouchableOpacity
              key={j}
              onPress={() => {
                if (tool.id === "crisisHelp") {
                  // open crisis modal
                  setCrisisModalVisible(true);
                } else {
                  router.push(tool.route as any);
                }
              }}
            >
              <Card style={styles.card}>
                <View style={styles.cardContent}>
                  <Image source={tool.icon} style={styles.icon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{tool.label}</Text>
                    <Text style={styles.description}>{tool.description}</Text>
                  </View>
                  <IconButton
                    icon={pinned.includes(tool.id) ? "pin" : "pin-outline"}
                    size={20}
                    // style={{ alignContent: "flex" }}
                    iconColor="#635b75"
                    onPress={() => togglePin(tool.id)}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <Portal>
        <Modal
          visible={crisisModalVisible}
          onDismiss={() => setCrisisModalVisible(false)}
          contentContainerStyle={styles.modalContentContainer}
        >
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <CrisisQuickView />
            <Button
              mode="outlined"
              onPress={() => setCrisisModalVisible(false)}
              style={{ marginTop: 20 }}
            >
              Close
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 35,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 12,
    marginTop: 30,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fef6f9",
    padding: 16,
    justifyContent: "center",
  },
  cardContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Main-font",
    color: "#3e2a6e",
  },
  description: {
    fontSize: 14,
    color: "#5e5e5e",
    fontFamily: "Main-font",
    marginTop: 2,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    height: 500,
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 16,
    alignSelf: "center",
  },
  
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
