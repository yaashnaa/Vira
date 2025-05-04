import React, { useState } from "react";
import { Modal, Portal, Button } from "react-native-paper";
import CrisisQuickView from "@/components/crisisQuickView";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter, Link } from "expo-router";
import WidgetCard from "../widgetCard";
import { Feather } from "@expo/vector-icons";

import { Pressable, StyleSheet, View } from "react-native";

interface QuickHelpWidgetProps {
  onRemove?: () => void;
}
const QuickHelpWidget: React.FC<QuickHelpWidgetProps> = ({ onRemove }) => {
  const [crisisModalVisible, setCrisisModalVisible] = useState(false);
  const router = useRouter();
  const handlePress = () => {
    setCrisisModalVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        {onRemove && (
          <Pressable onPress={onRemove} style={styles.removeIcon}>
            <Feather name="minus-circle" color="#c13e6a" size={20} />
          </Pressable>
        )}
        <WidgetCard
          title="Insights"
          imageSource={require("../../assets/images/widgetImages/sos.png")}
          onPress={handlePress}
        />
      </View>
      <Portal>
        <Modal
          visible={crisisModalVisible}
          onDismiss={() => setCrisisModalVisible(false)}
          contentContainerStyle={styles.modalContentContainer}
        >
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <CrisisQuickView />
            <Button
              mode="outlined"
              onPress={() => setCrisisModalVisible(false)}
              style={{ marginTop: 20, backgroundColor: "#86508f" }}
              textColor="#ffffff" 
            >
              Close
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  removeIcon: {
    position: "absolute",
    top: 18,
    left: 100,
    zIndex: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 16,
    alignSelf: "center",
  },
});

export default QuickHelpWidget;
