import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { selfLoveQuotes } from "@/utils/quotes";

const { width } = Dimensions.get("window");

export default function QuoteBanner() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(
    null
  );
  const fadeAnim = useRef(new Animated.Value(0)).current; // start fully transparent

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * selfLoveQuotes.length);
    setQuote(selfLoveQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    if (quote) {
      Animated.timing(fadeAnim, {
        toValue: 1, // fade in to full opacity
        duration: 1000, // over 1 second
        useNativeDriver: true,
      }).start();
    }
  }, [quote]);

  if (!quote) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Today's Quote</Text>

      <Text style={styles.quoteText}>“{quote.quote}”</Text>
      <Text style={styles.authorText}>— {quote.author}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f5ff",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    width: width * 0.9,
    alignSelf: "center",
    // alignItems: "center",
    shadowColor: "#cbbcf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title:{
    fontSize: 25,
    fontFamily: "PatrickHand-Regular",
    marginBottom: 15,
    textAlign: "center",
  },
  quoteText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#4a3147",
    textAlign: "center",
    fontFamily: "PatrickHand-Regular",
    lineHeight: 26,
  },
  authorText: {
    fontSize: 14,
    // marginTop: 12,
    color: "#7b4ca0",
    textAlign: "right",
    fontFamily: "Main-font",
  },
});
