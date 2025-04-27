import React, { useState } from "react";
import { View, Text, StyleSheet, LayoutAnimation, UIManager, Platform } from "react-native";
import { Card, IconButton } from "react-native-paper";
import CommentSection from "./commentSection"; // <-- Import your CommentSection

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DiscussionCard({ post, category }: { post: any; category: string }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  if (!post) return null;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.text}>{post.text}</Text>

        <View style={styles.actions}>
          <IconButton
            icon={expanded ? "comment-remove-outline" : "comment-outline"}
            size={20}
            onPress={toggleExpand}
          />
        </View>
        {expanded && (
          <CommentSection
            category={category}
            postId={post.id}
          />
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    fontFamily: "Main-font",
    color: "#3e2a6e",
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
});
