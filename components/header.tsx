import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";
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

  return (
    <HeaderRNE
      containerStyle={styles.container}
      leftComponent={
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          onPress={() => router.replace(backPath as any)}
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
      rightComponent={
        showSettings ? (
          <View>
            <TouchableOpacity
              style={{
                marginLeft: 12,
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
              onPress={() => router.replace("/settings")}
            >
              <Icon name="settings" size={25} type="feather" color="#271949" />
            </TouchableOpacity>
          </View>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8edeb",
    borderBottomWidth: 0,
    paddingBottom: 12,
    paddingTop: 12,
    height: 110,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    margin: "auto",
  },
  title: {
    color: "#271949",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "PatrickHand-Regular",
  },
});
