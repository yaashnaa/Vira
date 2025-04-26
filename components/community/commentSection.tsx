import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { createComment, listenToComments } from "@/utils/community"; // update path if needed

export default function CommentSection({
  category,
  postId,
  onCommentPosted, // 👈 Add this prop
}: {
  category: string;
  postId: string;
  onCommentPosted?: () => void;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const unsubscribe = listenToComments(category, postId, setComments);
    return () => unsubscribe();
  }, [category, postId]);

  const handlePostComment = async () => {
    await createComment(category, postId, newComment);
    setNewComment("");
    onCommentPosted?.(); // 👈 Collapse after posting
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No comments yet. Be the first!</Text>
        }
      />
      <View style={styles.commentContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Write a comment..."
          style={styles.input}
        />
        <Button
          //   mode="contained"
          onPress={handlePostComment}
          style={styles.button}
          textColor="#050505"
          disabled={!newComment.trim()}
        >
          Comment
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  commentContainer: {
    backgroundColor: "#fdf4ff", // a softer pinkish background
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  commentCard: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
    fontFamily: "PatrickHand-Regular",
    color: "#6b4c9a",
  },
  text: {
    fontSize: 14,
    fontFamily: "Main-font",
    color: "#333",
  },
  empty: {
    fontSize: 14,
    color: "#aaa",
    fontFamily: "Main-font",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    height: 90,
    borderWidth: 1,
    borderColor: "#ddd",
    fontFamily: "Main-font",
    marginTop: 10,
    fontSize: 14,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "#865dff",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
});
