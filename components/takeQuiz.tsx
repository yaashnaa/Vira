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
import AntDesign from "@expo/vector-icons/AntDesign";
interface TakeQuizButtonProps {
  onPress: () => void;
}
const { width } = Dimensions.get("window");
const height = Dimensions.get("window").height;
export default function TakeQuiz({ onPress }: TakeQuizButtonProps) {
  return (
    <View style={{width: width }}>
      <Pressable style={styles.button} onPress={onPress}>
        <Image
          source={require("../assets/images/takeQuiz.png")} // Replace with your own image path
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text
            style={{
              fontFamily: "Main-font",
              fontSize: 15,
              marginBottom: 10,
              marginTop: 10,
              width: "100%",
            }}
          >
            Personalize your experience
          </Text>
          <Text
            style={{
              fontSize: 10,
              width: "80%",
              marginBottom: 10,
              color: "#333",
            }}
          >

            Take a short quiz to tailor the app just for you
          </Text>
          <Text
            style={[
              styles.text,
              {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            Take the quiz{" "}
            <AntDesign name="arrowright" size={14} color="black" />
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.2,
    display: "flex",
    flexDirection: "row",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    // Optional shadow/elevation
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginLeft: 0,
    // width: "30%",
    alignSelf: "center",
  },
  image: {
    width: "35%",

    height: height * 0.17,
    resizeMode: "contain",
    marginBottom: 8,
    marginRight: 10,
    marginLeft: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",

    width: 150,
    margin: 0,
    padding: 2,
    borderRadius: 15,
    textAlign: "center",
    fontFamily: "Main-font",
    backgroundColor: "rgba(195,177,225, 0.3)",
  },
});
