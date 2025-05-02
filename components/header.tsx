import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions, SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  showSettings?: boolean;
  backPath?: string;
}

export default function Header({
  title,
  showSettings = true,
  backPath = "/dashboard",
}: CustomHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backPath) {
      router.replace(backPath as any);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#f8edeb" }}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={25} color="#271949" />
      </TouchableOpacity>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
    </SafeAreaView>

  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8edeb",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 30,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginLeft: -30, // center alignment compensation
  },
  title: {
    color: "#271949",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
  },
});
