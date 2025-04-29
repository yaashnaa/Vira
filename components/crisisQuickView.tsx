import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  YellowBox,
} from "react-native";
import { Card, Divider } from "react-native-paper";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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

export default function CrisisQuickView() {
  const [userContacts, setUserContacts] = useState<Contact[]>([]);
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

  return (
    <ScrollView>
      <Text style={styles.header}>Emergency Resources 🚨</Text>
      {preFilledContacts.map((contact, idx) => (
        <Card key={idx} style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{contact.label}</Text>
            <Text style={styles.text}>{contact.description}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${contact.phone}`)}
            >
              <Text style={styles.phoneLink}>📞 {contact.phone}</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      ))}

      <Divider style={styles.divider} />

      {userContacts.length > 0 && (
        <>
          <Text style={styles.header}>Your Emergency Contacts</Text>
          {userContacts.map((contact, idx) => (
            <Card key={idx} style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>{contact.label}</Text>
                <Text style={styles.text}>{contact.description}</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${contact.phone}`)}
                >
                  <Text style={styles.phone}>📞 {contact.phone}</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 22,
        fontFamily: "PatrickHand-Regular",
        color: "#3e2a6e",
        marginBottom: 12,
        marginTop: 16,
    },
    card: {
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
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
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 20,
    },
    phoneLink: {
        marginTop: 4,
        fontFamily: "Main-font",
        color: "#865dff",
        textDecorationLine: "none",
     
    },
});
