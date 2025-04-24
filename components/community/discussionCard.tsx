// components/community/DiscussionCard.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, LayoutAnimation, UIManager, Platform } from "react-native";
import { Card, Button, IconButton } from "react-native-paper";
import { createComment, listenToComments } from "@/utils/community"; // update path if needed

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DiscussionCard({ post, category }: { post: any; category: string }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (expanded) {
      const unsubscribe = listenToComments(category, post.id, setComments);
      return unsubscribe;
    }
  }, [expanded]);

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
          <IconButton icon="comment-outline" size={20} onPress={toggleExpand} />
          <Text style={styles.count}>{comments.length}</Text>
        </View>
        {expanded && (
          <View style={styles.comments}>
            {comments.map((comment) => (
              <Text key={comment.id} style={styles.comment}>• {comment.text}</Text>
            ))}
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <Button
              mode="text"
              onPress={async () => {
                await createComment(category, post.id, newComment);
                setNewComment("");
              }}
            >
              Add Comment
            </Button>
          </View>
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
  author: {
    fontSize: 12,
    color: "#7b6c8a",
    fontFamily: "Main-font",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  comments: {
    marginTop: 12,
    backgroundColor: "#f9f6ff",
    borderRadius: 10,
    padding: 10,
  },
  comment: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    fontFamily: "Main-font",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    borderColor: "#ddd",
    borderWidth: 1,
    marginTop: 8,
    fontFamily: "Main-font",
  },
});

