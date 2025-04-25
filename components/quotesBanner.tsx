// components/QuoteBanner.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { selfLoveQuotes } from "@/utils/quotes";

export default function QuoteBanner() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * selfLoveQuotes.length);
    setQuote(selfLoveQuotes[randomIndex]);
  }, []);

  if (!quote) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>“{quote.quote}”</Text>
      <Text style={styles.author}>— {quote.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0ebf8",
    padding: 20,
    borderRadius: 12,
    margin: 16,
    alignItems: "center",
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#4a3147",
    fontFamily: "Main-font",
  },
  author: {
    fontSize: 14,
    color: "#7b4ca0",
    marginTop: 10,
    fontFamily: "Main-font",
  },
});
