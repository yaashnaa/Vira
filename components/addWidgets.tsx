import React, { useState } from "react";
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import BasicButton from "./basicButton";
import { lightTheme } from "@/config/theme";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AddWidgetButton = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  // Example list of available widgets
  const widgets = [
    { id: "1", name: "Weather" },
    { id: "2", name: "Calendar" },
    { id: "3", name: "News" },
    { id: "4", name: "Stocks" },
  ];

  const handleAddWidget = (widgetId: string) => {
    // Handle adding widget to dashboard here
    console.log("Adding widget with id:", widgetId);
    // Optionally collapse the list after selection
    setExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpanded} style={[styles.button, { flexDirection: "row", alignItems: "center" }]}> 
      <Entypo name="plus" size={24} color="black" />
        <Text>Add Widget</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.widgetList}>
          {widgets.map(widget => (
            <TouchableOpacity 
              key={widget.id} 
              style={styles.widgetItem} 
              onPress={() => handleAddWidget(widget.id)}
            >
              <Text style={styles.widgetText}>{widget.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  widgetList: {
    marginTop: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 10,
    width: "80%",
  },
  widgetItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  widgetText: {
    fontSize: 16,
  },
   button: {
      width: 240,
      borderRadius: 15,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      color: "black",
      borderWidth: 3,
      borderColor: lightTheme.accent,
      borderStyle: "solid",
      shadowColor: lightTheme.secondary,
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 9.55,
      shadowRadius: 3.84,
  
      elevation: 2,
    },
});

export default AddWidgetButton;
