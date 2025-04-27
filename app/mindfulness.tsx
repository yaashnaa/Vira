import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
} from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import Header from "@/components/header";
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from "lottie-react-native";
const techniques = [
  { title: "Breathing Exercise", route: "/BreathingExercise", icon: require("../assets/images/widgetImages/breathing.png") },
  { title: "Body Scan", route: "/BodyScanExercise", icon: require("../assets/images/widgetImages/bodyScan.png") },
  { title: "Five Senses", route: "/FiveSensesExercise", icon: require("../assets/images/widgetImages/senses.png") },
];

const videos = [
  {
    title: "5-Minute Breathing Exercise",
    url: "https://www.youtube.com/watch?v=nmFUDkj1Aq0",
    icon: require("../assets/images/widgetImages/video.png") 

  },
  {
    title: "Guided Body Scan Meditation",
    url: "https://www.youtube.com/watch?v=QS2yDmWk0vs",
    icon: require("../assets/images/widgetImages/video.png") 

  },
  {
    title: "5-4-3-2-1 Grounding Technique",
    url: "https://www.youtube.com/watch?v=9S3whGkwhGI",
    icon: require("../assets/images/widgetImages/video.png") 
 
  },
];

export default function MindfulnessHomeScreen() {
  const router = useRouter();
  const [videosCollapsed, setVideosCollapsed] = React.useState(true);
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Cannot open URL:", url);
    }
  };

  return (
    <>
      <Header title="Mindfulness Hub" />
    
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
          <LottieView
        source={require("../assets/animations/mindfulness.json")}
        autoPlay
        loop
        style={{ width: width, height: 200, alignSelf: "center" }}
      />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Explore Techniques</Text>
          {techniques.map((tech, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                router.push(tech.route as Parameters<typeof router.push>[0])
              }
            >
              <Card style={styles.techniqueCard}>
                <Card.Content style={styles.cardContent}>
                  <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                  <Image source={tech.icon} style={styles.icon} />
                  <Text style={styles.techniqueText}>{tech.title}</Text>
                  </View>

                  <AntDesign name="right" size={24} color="black"  style={{ marginLeft: 60, alignSelf:"center", justifyContent: "flex-end"}}/>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.VideoSection}>
          <TouchableOpacity
            onPress={() => setVideosCollapsed(!videosCollapsed)}
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingHorizontal: 16, paddingVertical: 10 }}
          >
            <Text style={styles.sectionTitle}>🎥 Helpful Video Resources</Text>
            <AntDesign
              name={videosCollapsed ? "down" : "up"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {!videosCollapsed &&
            videos.map((video, idx) => (
              <TouchableOpacity key={idx} onPress={() => openLink(video.url)}>
          <Card style={styles.videoCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.videoTitle}>{video.title}</Text>
            </Card.Content>
          </Card>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  VideoSection:{
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  content: {
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: "PatrickHand-Regular",
    color: "#17092d",
    marginBottom: 20,
    textAlign: "center",
  },
  techniqueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 4,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 50,
    justifyContent: "center",
  },
  videoCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 6,
    marginBottom: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    minHeight: 40,
    justifyContent: "center",
  },
  techniqueText: {
    fontSize: 18,
    fontFamily: "Main-font",
    color: "#374151",
    marginLeft: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: "Main-font",
    color: "#1E40AF",
    marginLeft: 12,
  },
  icon: {
    width: 39,
    height: 39,
    resizeMode: "contain",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
