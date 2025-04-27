import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";

import { SegmentedButtons, Modal, Portal, Card } from "react-native-paper";
import ChatBot from "@/components/ThoughtReframe/chatbot";
import ManualReframe from "@/components/ThoughtReframe/manualReframe";
import Header from "@/components/header";
import Collapsible from "react-native-collapsible";
import { Icon } from "react-native-paper";
import ThoughtReframeHistory from "@/components/ThoughtReframe/history"; // 💡 Assuming you created a ThoughtReframeHistory.tsx component

export default function ThoughtReframeScreen() {
  const [mode, setMode] = useState<"chat" | "manual">("chat");
  const [expanded, setExpanded] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

  return (
    <>
      <Header title="Thought Reframe" />
      <SafeAreaView style={styles.container}>
        <View style={styles.topRow}>
          <SegmentedButtons
            value={mode}
            onValueChange={(value) => setMode(value as "chat" | "manual")}
            buttons={[
              { value: "chat", label: "Talk it Out", uncheckedColor: "#888" },
              {
                value: "manual",
                label: "Reframe Manually",
                uncheckedColor: "#888",
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

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
              Learn more at{" "}
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

        {/* ✨ Thought Reframe History Modal */}
        <Portal>
          <Modal
            visible={historyVisible}
            onDismiss={() => setHistoryVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.historyTitle}>Your Thought Reframes</Text>
            <ThoughtReframeHistory />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setHistoryVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  segmentedButtons: {
    flex: 1,
  },
  historyButton: {
    marginLeft: 10,
    backgroundColor: "#f2e8ff",
    padding: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    margin: "auto",
    marginBottom: 25,
    marginTop: 30,
  },
  headerText: {
    color: "#622f00",
    fontWeight: "600",
    fontSize: 19,
    fontFamily: "PatrickHand-Regular",
  },
  content: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    fontFamily: "Main-font",
    margin: 20,
  },
  link: {
    color: "#8652e0",
    textDecorationLine: "underline",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 20,
    maxHeight: "80%",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "PatrickHand-Regular",
    color: "#6b4c9a",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#d2c2ed",
    padding: 10,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "#4b2b82",
  },
});
