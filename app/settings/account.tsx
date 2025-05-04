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
// Somewhere at top of file
const PASSWORD_ERROR_MESSAGES: Record<
  string,
  { title: string; message: string }
> = {
  "auth/wrong-password": {
    title: "Incorrect Password",
    message: "The current password you entered is incorrect.",
  },
  "auth/weak-password": {
    title: "Weak Password",
    message: "Your new password is too weak. It must be at least 6 characters.",
  },
  "auth/requires-recent-login": {
    title: "Re-authenticate Required",
    message: "Please log in again before changing your password.",
  },
  "auth/invalid-credential": {
    title: "Invalid Credential",
    message: "The password provided is invalid.",
  },
};

const EMAIL_ERROR_MESSAGES: Record<string, { title: string; message: string }> =
  {
    "auth/invalid-email": {
      title: "Invalid Email",
      message: "That email address doesn’t look right.",
    },
    "auth/email-already-in-use": {
      title: "Email In Use",
      message: "That email is already linked to another account.",
    },
    "auth/requires-recent-login": {
      title: "Re-authenticate Required",
      message: "Please log in again before changing your email.",
    },
  };

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

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Passwords Don’t Match",
        text2: "Please make sure both fields are identical.",
      });
    }

    if (!user?.email) return;

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Toast.show({
        type: "success",
        text1: "Password Updated",
        text2: "Your password has been changed successfully.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const { code, message } = err;
      const errInfo = PASSWORD_ERROR_MESSAGES[code];
      Toast.show({
        type: errInfo ? "error" : "error",
        text1: errInfo?.title || "Error Changing Password",
        text2: errInfo?.message || message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);

      Toast.show({
        type: "success",
        text1: "Email Updated",
        text2: "Your email address has been changed.",
      });
    } catch (err: any) {
      const { code, message } = err;
      const errInfo = EMAIL_ERROR_MESSAGES[code];
      Toast.show({
        type: "error",
        text1: errInfo?.title || "Error Changing Email",
        text2: errInfo?.message || message || "Something went wrong.",
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
            router.replace("/(auth)/login");
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
          labelStyle={{ color: "#ffffff" }}
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
    height: "100%",
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
    color: "#fff",
    backgroundColor: "#885291",
    borderRadius: 8,
  },
  outlinedButton: {
    marginTop: 20,
    borderRadius: 8,
    borderColor: "red",
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: "#885291",
  },
});
