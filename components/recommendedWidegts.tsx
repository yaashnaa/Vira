import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";

const recommendedWidgets = [
  {
    id: "1",
    title: "Nutrition",
    image: require("../assets/images/widgetImages/vegetable.jpg"),
    link: '../app/nurtition.tsx'
  },
  {
    id: "2",
    title: "Mindfullness",
    image: require("../assets/images/widgetImages/meditation.png"),
  },
  {
    id: "3",
    title: "Water Intake",
    image: require("../assets/images/widgetImages/water.jpg"),
  },
  {
    id: "4",
    title: "Exercise",
    image: require("../assets/images/widgetImages/stretch.jpg"),
  },
  {
    id: "5",
    title: "Journal",
    image: require("../assets/images/widgetImages/journal.png"),
  },
];

const { width } = Dimensions.get("window");

export default function RecommendedWidgetsBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended Widgets</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {recommendedWidgets.map((widget) => (
          <View key={widget.id} style={styles.widgetCard}>
            <Image source={widget.image} style={styles.widgetImage} />
            <View style={styles.cardFooter}>
              {/* The Text is on the left, Icon on the right */}
              <Text style={styles.widgetTitle}>{widget.title}</Text>
              
              <IconButton
                icon="plus"
                mode="outlined"
                theme={{ colors: { primary: '#C3B1E1' } }}
                containerColor="rgba(195,177,225, 0.3)"
                size={30}
                onPress={() => console.log("Pressed")}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 16,
  },
  scrollContainer: {
    paddingLeft: 16,
  },
  widgetCard: {
    width: width * 0.6,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    // We center the image horizontally but the footer is a row layout
    alignItems: "center",
    justifyContent: "flex-start",
  },
  widgetImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
