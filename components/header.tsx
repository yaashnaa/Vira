import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  showSettings?: boolean;
  backPath?: string; // fallback path if cannot go back
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
    <HeaderRNE
      containerStyle={styles.container}
      leftComponent={
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 30,
          }}
          onPress={handleBack}
        >
          <Icon name="arrow-back" size={25} type="ionicon" color="#271949" />
        </TouchableOpacity>
      }
      centerComponent={{
        text: title,
        style: styles.title,
      }}
      centerContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8edeb",
    borderBottomWidth: 0,
    paddingTop: 10,
  },
  title: {
    color: "#271949",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
  },
});
