import React, { useState } from "react";
import { View } from "react-native";
import { Menu, Button } from "react-native-paper";

export default function FilterMenu({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("All");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value.toLowerCase());
    closeMenu();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={{ backgroundColor: "#ffffff" }}
        style={{ width: 200, backgroundColor: "#f0f0f0" }}
        anchor={<Button onPress={openMenu}>Filter: {selected}</Button>}
      >
        <Menu.Item
          onPress={() => handleSelect("All")}
          title="All"
          titleStyle={{ color: "darkpurple" }}
        />
        <Menu.Item
          onPress={() => handleSelect("Easy")}
          title="Easy"
          titleStyle={{ color: "darkpurple" }}
        />
\
        <Menu.Item
          onPress={() => handleSelect("High Protein")}
          title="High Protein"
          titleStyle={{ color: "darkpurple" }}
        />
        <Menu.Item
          onPress={() => handleSelect("Under 30 Minutes")}
          title="Under 30 Minutes"
          titleStyle={{ color: "darkpurple" }}
        />
        {/* <Menu.Item
          onPress={() => handleSelect("breakfast")}
          title="Breakfast"
          titleStyle={{ color: "darkpurple" }}
        />
        <Menu.Item
          onPress={() => handleSelect("lunch")}
          title="Lunch"
          titleStyle={{ color: "darkpurple" }}
        />
        <Menu.Item
          onPress={() => handleSelect("dinner")}
          title="Dinner"
          titleStyle={{ color: "darkpurple" }}
        />
        <Menu.Item
          onPress={() => handleSelect("snack")}
          title="Snack"
          titleStyle={{ color: "darkpurple" }}
        /> */}
      </Menu>
    </View>
  );
}
