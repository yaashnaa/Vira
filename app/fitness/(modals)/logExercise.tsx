import {  StyleSheet, Dimensions } from "react-native";
import LogExercise from "../../../components/Exercise/logExercise";

import { SafeAreaView } from "react-native-safe-area-context";
export const dynamic = "force-static";
export const modal = true;
export const presentation = "card"; 
export const animation = "slide_from_right"; 
export default function logExercise() {
  return (

      <LogExercise />

  );
}
const { height } = Dimensions.get("window");
const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontFamily: "PatrickHand-Regular",
    color: "#271949",
    marginBottom: 20,
    marginTop: 20,
  },
});
