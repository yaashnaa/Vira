import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";

import { SegmentedButtons } from "react-native-paper";

import ChatBot from "@/components/ThoughtReframe/chatbot";
import ManualReframe from "@/components/ThoughtReframe/manualReframe";
import Header from "@/components/header";
import Collapsible from "react-native-collapsible";
import { Icon } from "react-native-paper";

export default function ThoughtReframeScreen() {
  const [mode, setMode] = useState<"chat" | "manual">("chat");
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Header
        title="Thought Reframe"
        backPath="/dashboard"
        showSettings={true}
      />
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={mode}
          onValueChange={(value) => setMode(value as "chat" | "manual")}
          buttons={[
            {
              value: "chat",
              label: "Talk it Out",
              uncheckedColor: "#888",
              //   checkedColor: "#271949",
            },
            {
              value: "manual",
              label: "Reframe Manually",
              uncheckedColor: "#888",
            },
          ]}
          style={styles.segmentedButtons}
        />
        <TouchableOpacity
          style={styles.header}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.headerText}>What is Thought Reframing?</Text>
          <Icon
            source={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#622f00"
          />
        </TouchableOpacity>

        <Collapsible collapsed={!expanded}>
          <View style={styles.content}>
            <Text style={styles.infoText}>
              Thought reframing is a CBT technique that helps you challenge
              negative or unhelpful thoughts and replace them with more balanced
              ones.
            </Text>
            <Text style={styles.infoText}>
              Learn more at
              <Text
                style={styles.link}
                onPress={() =>
                  Linking.openURL(
                    "https://www.psychologytools.com/self-help/thought-records/"
                  )
                }
              >
                psychologytools.com
              </Text>
            </Text>
          </View>
        </Collapsible>
        <View style={{ flex: 1, marginTop: 0 }}>
          {mode === "chat" ? <ChatBot /> : <ManualReframe />}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  segmentedButtons: {
    marginBottom: 0,
    width: "90%",
    justifyContent: "center",
    margin: "auto",
    borderRadius: 0,
    marginTop: 20,
    fontFamily: "Comfortaa-Regular",
  },
  card: {
    backgroundColor: "#f8f6f4",
    borderRadius: 12,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    margin: "auto",
    marginBottom: 25,
  },
  headerText: {
    color: "#622f00",
    fontWeight: "600",
    fontSize: 19,
    marginTop:30,
    fontFamily: "patrickHand-regular",
  },
  content: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontFamily: "Main-font",
    margin: 20
  },
  link: {
    color: "#8652e0",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Main-font",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginTop: 8,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#d2c2ed",
  },
});
