import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { Header as HeaderRNE, Icon } from "@rneui/themed";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
export default function Mindfullness() {
  const router = useRouter();
  const mindfullnessLottie = require("../assets/animations/underConstruction.json");
  const handleBackPress = () => {
    router.replace("/dashboard");
  };
  return (
    <>
      <HeaderRNE
        containerStyle={{
          backgroundColor: "#f8edeb",
          borderBottomWidth: 0,
          paddingTop: 10,
        }}
        leftComponent={
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={25} type="ionicon" color="#271949" />
          </TouchableOpacity>
        }
        centerComponent={{
          text: "MINDFULLNESS",
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
              <Icon name="settings" size={25} type="feather" color="#271949" />
            </TouchableOpacity>
          </View>
        }
      />
      <Text style={styles.title}> We are currently under construction 🚧</Text>
      <Text style={styles.subtitle}> Check back again soon!</Text>
      <View style={styles.container}>
        <LottieView
          source={mindfullnessLottie}
          autoPlay
          loop
          style={{
            width: width *1.2,
            height: height ,
            marginLeft: 10,
            marginBottom: 20,
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f5f5f5",
    display: "flex",
    margin:"auto",
  },
  text: {
    fontSize: 18,
    top: 60,
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    marginTop: 5,
  },
  title: {
    fontSize: 28,
    top: 60,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PatrickHand-Regular",
  },
  subtitle:{
    top: 60,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "PatrickHand-Regular",
    color: "#666",
  }
});

