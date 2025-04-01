import React from "react";
import {
  Pressable,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-paper";
interface LogMoodButtonProps {
  onPress: () => void;
}
const { width } = Dimensions.get("window");
export default function LogMoodButton({ onPress }: LogMoodButtonProps) {
  return (
    <View>
      <Pressable style={styles.button} onPress={onPress}>
        <Divider bold={true} />
        <Text
          style={{
            fontFamily: "Main-font",
            fontSize: 20,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          How are you feeling today?
        </Text>
        <Divider />
        <Image
          source={require("../assets/images/mood/moodScale.png")} // Replace with your own image path
          style={styles.image}
        />
        <Text style={styles.text}>Log your mood</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width * 0.9,
    justifyContent: "center",
    margin: "auto",
    alignItems: "center",
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    // Optional shadow/elevation
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 350,
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    width: "100%",
    margin: 0,
    padding: 5,
    textAlign: "center",
    fontFamily: "Main-font",
    backgroundColor: "rgba(195,177,225, 0.3)",
  },
});
