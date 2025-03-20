import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { lightTheme } from "@/config/theme";

export default function NewHome() {
  const router = useRouter();

  const handleQuickStart= ()=>{
    router.replace("/dashboard"); // Redirect to Quick Start screen
  }
  const handlePersonalise= ()=>{
    router.replace("/personalization/setup"); // Redirect to Quick Start screen
  }

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     router.replace("/welcome");
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  return (
    <View style={[styles.container, { backgroundColor: lightTheme.background }]}>
      <Text style={[styles.title, { color: lightTheme.text }]}>Welcome to Vira!</Text>
      <View style={[styles.buttonContainer]}> 
      <TouchableOpacity style={[styles.button]} onPress={handleQuickStart}>
        <Text style={styles.buttonText}>Quick Start</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button]} onPress={handlePersonalise}>
        <Text style={styles.buttonText}> Personalize My Experience”</Text>
      </TouchableOpacity>
      </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center"
  },
  title: {
    fontSize: 24, fontWeight: "bold"
  },
  button: {
    marginTop: 20, padding: 15, backgroundColor: "red", borderRadius: 10
  },
  buttonText: {
    color: "#fff", fontSize: 16, fontWeight: "bold"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
  }
});
