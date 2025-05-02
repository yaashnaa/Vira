import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";

import { Button } from "react-native-paper";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/header";

import { auth } from "@/config/firebaseConfig";
import { deleteAccount, logoutUser } from "@/utils/auth";
import { useRouter } from "expo-router";

import { useUserPreferences } from "@/context/userPreferences";
export default function AccountSettingsSection() {
  const user = auth.currentUser;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const { userPreferences } = useUserPreferences();

  const [showEmailSection, setShowEmailSection] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      Toast.show({
        type: "info",
        text1: "Test Toast",
        text2: "Does this show on this screen?",
      });
    }, 1000);
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New passwords do not match.");
      return;
    }

    if (!user?.email) return;
    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password updated successfully.",
        position: "bottom",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.log("🔥 Toast should trigger now:", error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong",
        position: "bottom",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      Alert.alert("Success", "Email updated.");
    } catch (error: any) {
      console.log("🔥 Toast should trigger now:", error.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Something went wrong",
        position: "bottom",
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert("Are you sure?", "This will permanently delete your account.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAccount();
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to delete account.");
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/login");    
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to log out.");
    }
  };

  return (
    <>
      <Header title="Account" />

      <View style={styles.section}>
        <Text style={styles.nameLabel}> Welcome, {userPreferences.name}</Text>
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setShowEmailSection((prev) => !prev)}
        >
          <Text style={styles.sectionHeading}>Change Email</Text>
          <Ionicons
            name={showEmailSection ? "chevron-up" : "chevron-down"}
            size={20}
            color="#130d22"
          />
        </TouchableOpacity>

        {showEmailSection && (
          <>
            <Text style={styles.label}>
              Current email:
              <Text style={{ marginBottom: 15 }}>{user?.email}</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new email"
              // value={newEmail}
              onChangeText={setNewEmail}
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Current password (to confirm)"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholderTextColor="#888"
            />
            <Button
              mode="contained"
              onPress={handleChangeEmail}
              style={styles.primaryButton}
              loading={loading}
            >
              Update Email
            </Button>
          </>
        )}
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setShowPasswordSection((prev) => !prev)}
        >
          <Text style={styles.sectionHeading}>Change Password</Text>
          <Ionicons
            name={showPasswordSection ? "chevron-up" : "chevron-down"}
            size={20}
            color="#3e2a6e"
          />
        </TouchableOpacity>

        {showPasswordSection && (
          <>
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#888"
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.primaryButton}
              loading={loading}
            >
              Change Password
            </Button>
          </>
        )}

        <Button
          textColor="red"
          onPress={handleDeleteAccount}
          style={styles.outlinedButton}
        >
          Delete Account
        </Button>

        <Button
          mode="text"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={{ color: "#865dff" }}
        >
          Log Out
        </Button>
      </View>
    </>
  );
}
const height = Dimensions.get("window").height;
const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    // marginTop: 24,
    backgroundColor: "#fff",
    height: height,
    marginBottom: 75,
  },
  sectionHeading: {
    fontSize: 20,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#3e2a6e",
    fontFamily: "Main-font",
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    color: "#333",
  },
  nameLabel: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: 16,
    fontFamily: "PatrickHand-Regular",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#fff",
    marginBottom: 10,
    fontFamily: "Main-font",
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: "#865dff",
    borderRadius: 8,
  },
  outlinedButton: {
    marginTop: 20,
    borderRadius: 8,
    borderColor: "red",
  },
  logoutButton: {
    marginTop: 12,
  },
});
