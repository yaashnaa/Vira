import React from "react";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import { List, Divider } from "react-native-paper";
import SettingsItem from "@/components/settingsItem"; // make sure you have this component created!
const { width } = Dimensions.get("window");
const {height} = Dimensions.get("window");
export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <List.Section>
        <List.Subheader style={styles.subheader}>Profile</List.Subheader>
        <SettingsItem title="Edit Profile" icon="account-edit" route="/settings/editProfile" />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Preferences</List.Subheader>
        <SettingsItem title="Mood Check-In Settings" icon="emoticon-happy-outline" route="/settings/preferences" />
        <SettingsItem title="Nutrition & Movement Preferences" icon="food-apple-outline" route="/settings/nutritionMovement" />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Account</List.Subheader>
        <SettingsItem title="Account Settings" icon="lock-reset" route="/settings/account" />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Notifications</List.Subheader>
        <SettingsItem title="Reminder Preferences" icon="bell-ring-outline" route="/settings/notifications" />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Help & Support</List.Subheader>
        <SettingsItem title="FAQs" icon="help-circle-outline" route="/settings/faq" />
        <SettingsItem title="Contact Support" icon="email-outline" route="/settings/support" />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Feedback</List.Subheader>
        <SettingsItem title="Send Feedback" icon="message-text-outline" route="/settings/feedback" />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>About</List.Subheader>
        <SettingsItem title="App Version" icon="information-outline" route="/settings/appVersion" />
        <SettingsItem title="Privacy Policy" icon="shield-lock-outline" route="/settings/privacyPolicy" />
        <SettingsItem title="Terms of Service" icon="file-document-outline" route="/settings/termsOfService" />
      </List.Section>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingLeft: 8,
    height: height,
    backgroundColor: "#ffffff",
  },
  subheader: {
    color: "#606060",
    fontFamily: "PatrickHand-Regular",
    fontSize: 16,
    paddingHorizontal: 16,
  },
});