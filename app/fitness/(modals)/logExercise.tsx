import { View, Text, StyleSheet, Dimensions } from "react-native";
import LogExercise from "../../../components/Exercise/logExercise";

import { SafeAreaView } from "react-native-safe-area-context";
export const dynamic = "force-static";
export const modal = true;
export const presentation = "card"; 
export const animation = "slide_from_right"; 
export default function logExercise() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#ffffff",
        justifyContent: "center",
        height: height,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 20,
        marginBottom:50
      }}
    >
      {/* <Text style={styles.title}>🏋️ Log Your Movement</Text> */}
      <LogExercise />
    </SafeAreaView>
  );
}
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#F8F9FA",
  //   padding: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  title: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    color: "#271949",
    marginBottom: 20,
    marginTop: 20,
  },
});
