import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { Card, Button, Divider } from "react-native-paper";
import { auth, db } from "@/config/firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import Collapsible from "react-native-collapsible";

const preFilledContacts = [
  {
    label: "Emergency Services",
    description: "Call 911 if you are in immediate danger or need urgent help.",
    phone: "911",
  },
  {
    label: "National Suicide Prevention Lifeline (US)",
    description: "24/7 confidential support for people in distress.",
    phone: "988",
  },
  {
    label: "Crisis Text Line",
    description: "Text HOME to 741741 to reach a trained crisis counselor.",
    phone: "741741",
  },
];

interface Contact {
  label: string;
  description: string;
  phone: string;
}

export default function CrisisPlanSection() {
  const [userContacts, setUserContacts] = useState<Contact[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchUserContacts();
  }, []);

  const fetchUserContacts = async () => {
    if (!uid) return;
    const ref = doc(db, "users", uid, "copingData", "crisisContacts");
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      setUserContacts(snapshot.data().contacts || []);
    }
  };

  const addUserContact = async () => {
    if (!uid || !newLabel.trim()) return;
    const contact = {
      label: newLabel.trim(),
      description: newDescription.trim(),
      phone: newPhone.trim(),
    };
    const ref = doc(db, "users", uid, "copingData", "crisisContacts");
    await setDoc(ref, { contacts: arrayUnion(contact) }, { merge: true });
    setNewLabel("");
    setNewDescription("");
    setNewPhone("");
    fetchUserContacts();
  };

  const removeUserContact = async (contact: Contact): Promise<void> => {
    if (!uid) return;
    const ref = doc(db, "users", uid, "copingData", "crisisContacts");
    await updateDoc(ref, { contacts: arrayRemove(contact) });
    fetchUserContacts();
  };

  const openModal = () => {
    setModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <ScrollView>
      <Text style={styles.header}> Your Crisis Plan 🚨</Text>

      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <Text style={styles.toggle}>
          {collapsed ? "▼ What is a Crisis Plan?" : "▲ What is a Crisis Plan?"}
        </Text>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed}>
        <Text style={styles.explanation}>
          A crisis plan helps you stay safe when things feel overwhelming. It can
          include emergency numbers, trusted contacts, and resources you can turn to
          when you need help.
        </Text>
      </Collapsible>

      <Text style={styles.subheader}>Emergency Resources</Text>
      {preFilledContacts.map((contact, idx) => (
        <Card key={idx} style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{contact.label}</Text>
            <Text style={styles.text}>{contact.description}</Text>
            <Text style={styles.phone}>📞 {contact.phone}</Text>
          </Card.Content>
        </Card>
      ))}

      <Divider style={styles.divider} />

      <Text style={styles.subheader}>Your Emergency Contacts</Text>
      {userContacts.map((contact, idx) => (
  <Card key={idx} style={styles.contactCard}>
    <Card.Content style={styles.contactRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.contactLabel}>{contact.label}</Text>
        <Text style={styles.contactDescription}>{contact.description}</Text>
        <Text style={styles.contactPhone}>📞 {contact.phone}</Text>
      </View>
      <Button
        icon="delete"
        mode="text"
        textColor="#696969"
        compact
        style={styles.deleteButton}
        onPress={() => removeUserContact(contact)}
      >
      <Text> </Text>  
      </Button>
    </Card.Content>
  </Card>
))}


      <Button
        mode="contained"
        onPress={openModal}
        style={{ marginTop: 16, borderRadius: 10 }}
      >
        Add New Contact
      </Button>


      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            <TextInput
              style={styles.input}
              value={newLabel}
              placeholder="Name or Role (e.g., Therapist)"
              onChangeText={setNewLabel}
              placeholderTextColor={"#999"}
            />
            <TextInput
              style={styles.input}
              value={newDescription}
                 placeholderTextColor={"#999"}
              placeholder="Description or notes"
              onChangeText={setNewDescription}
            />
            <TextInput
              style={styles.input}
              value={newPhone}
              placeholderTextColor={"#999"}
              placeholder="Phone Number"
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
              <Button onPress={closeModal}>Cancel</Button>
              <Button
                mode="contained"
                onPress={() => {
                  addUserContact();
                  closeModal();
                }}
              >
                Save
              </Button>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 12,
    // marginTop: 32,
  },
  toggle: {
    fontSize: 16,
    color: "#865dff",
    fontFamily: "Main-font",
    marginBottom: 10,
  },
  explanation: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#5e4a7d",
    backgroundColor: "#fef6fb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff0f6",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 4,
    marginLeft: 8,
    position: "absolute",
    right: 0,
    top: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 16,
    textAlign: "center",
  },
  
  subheader: {
    fontSize: 20,
    fontFamily: "PatrickHand-Regular",
    color: "#291b52",
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: "Main-font",
    color: "#3e2a6e",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#444",
  },
  phone: {
    marginTop: 4,
    fontFamily: "Main-font",
    color: "#865dff",
  },
  inputTitle: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    fontFamily: "Main-font",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  contactCard: {
    backgroundColor: "#fffafc",
    marginBottom: 12,
    borderRadius: 14,
    elevation: 1,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // gap: 10,
  },
  contactLabel: {
    fontSize: 16,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    // marginBottom: 2,
  },
  contactDescription: {
    fontSize: 13,
    fontFamily: "Main-font",
    color: "#5e4a7d",
  },
  contactPhone: {
    fontSize: 13,
    fontFamily: "Main-font",
    color: "#865dff",
    // marginTop: 4,
  },
  
});
