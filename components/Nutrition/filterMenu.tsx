import React, { useState } from "react";
import { View } from "react-native";
import { Menu, Button } from "react-native-paper";

export default function FilterMenu({ onSelect }: { onSelect: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("All");

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    closeMenu();
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
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
      </Menu>
    </View>
  );
}
