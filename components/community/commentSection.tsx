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
      marginTop: 12,
    },
    commentContainer: {
      backgroundColor: "#fef9f6",
      borderRadius: 12,
      padding: 14,
      marginTop: 12,
    //   elevation: 2,
    },
    commentCard: {
      marginBottom: 10,
      backgroundColor: "#ffffff",
      borderRadius: 10,
      padding: 10,
      marginLeft: 30,
      borderColor: "#eee",
    //   borderWidth: 1,
    },
    name: {
      fontWeight: "bold",
      fontSize: 14,
      marginBottom: 2,
      fontFamily: "Main-font",
      color: "#3e2a6e",
    },
    text: {
      fontSize: 14,
      fontFamily: "Main-font",
      color: "#333",
    },
    empty: {
      fontSize: 13,
      color: "#999",
      fontFamily: "Main-font",
      textAlign: "center",
      marginVertical: 10,
    },
    input: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 10,
      height: 90,
      borderWidth: 1,
      borderColor: "#ccc",
      fontFamily: "Main-font",
      marginTop: 8,
      textAlignVertical: "top",
    },
    button: {
      marginTop: 8,
      alignSelf: "flex-end",
      backgroundColor: "#865dff",
      paddingHorizontal: 20,
      paddingVertical: 6,
      borderRadius: 8,
    },
  });
  
