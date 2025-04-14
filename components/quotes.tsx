// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// export default function Quotes() {
//   const [quote, setQuote] = useState("");
//   const [author, setAuthor] = useState("");
//   const [loading, setLoading] = useState(true);

//   const getQuote = async () => {
//     try {
//       const res = await fetch("https://api.quotable.io/quotes/random?limit=1");
//       const data = await res.json();
//       const randomQuote = data[0]; // response is an array
//       setQuote(randomQuote.content);
//       setAuthor(randomQuote.author);
//     } catch (err) {
//       if (err instanceof Error) {
//         console.error("❌ Fetch error:", err.message);
//       } else {
//         console.error("❌ Fetch error:", err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getQuote();
//   }, []);

//   if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.quoteText}>"{quote}"</Text>
//       <Text style={styles.authorText}>— {author}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     marginTop: 50,
//   },
//   quoteText: {
//     fontSize: 20,
//     fontStyle: "italic",
//     marginBottom: 10,
//     color: "#333",
//   },
//   authorText: {
//     fontSize: 16,
//     textAlign: "right",
//     color: "#555",
//   },
// });
