import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { List, Divider } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List.Section>
        <List.Subheader style={styles.subheader}>Profile</List.Subheader>
        <List.Item
          title="Edit Profile"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="account-edit" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => router.push("/settings/editProfile")}
        />
  
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Preferences</List.Subheader>
        <List.Item
          title="Mood Check-In Settings"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="emoticon-happy-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => router.push("/settings/preferences")}
        />
        <List.Item
          title="Nutrition & Movement Preferences"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="food-apple-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => router.push("/settings/nutritionMovement")}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>Account</List.Subheader>
        <List.Item
          title="Account Settings"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="lock-reset" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/account")}}
        />

      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>
           Notifications
        </List.Subheader>
        <List.Item
          title="Reminder Preferences"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="bell-ring-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/notifications")}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>
          Help & Support
        </List.Subheader>
        <List.Item
          title="FAQs"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="help-circle-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/faq")}}
        />
        <List.Item
          title="Contact Support"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="email-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/support")}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}> Feedback</List.Subheader>
        <List.Item
          title="Send Feedback"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="message-text-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/feedback")}}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={styles.subheader}>About</List.Subheader>
        <List.Item
          title="App Version 1.0.0"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="information-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/appVersion")}}
        />
        <List.Item
          title="Privacy Policy"
          titleStyle={styles.item}
          left={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="shield-lock-outline" color="#190028" />
            </View>
          )}
          right={() => (
            <View style={styles.iconContainer}>
              <List.Icon icon="chevron-right" color="#190028" />
            </View>
          )}
          onPress={() => {router.push("/settings/privacyPolicy")}}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  item: {
    color: "#2a2a2a",
    fontFamily: "Main-font",
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 28,
    marginRight: 8,
  },
  subheader: {
    color: "#606060",
    fontFamily: "PatrickHand-Regular",
    fontSize: 16,
    paddingHorizontal: 16,
  },
});
