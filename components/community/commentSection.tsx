import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { createComment, listenToComments } from "@/utils/community";
import { deleteDoc, doc } from "firebase/firestore";
import { increment, updateDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebaseConfig";
import Feather from "@expo/vector-icons/Feather";
import Toast from "react-native-toast-message";
import { Filter } from "bad-words";

export default function CommentSection({
  category,
  postId,
  onCommentPosted,
}: {
  category: string;
  postId: string;
  onCommentPosted?: () => void;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const currentUid = auth.currentUser?.uid;
  const [isPosting, setIsPosting] = useState(false);
  const filter = new Filter();

  useEffect(() => {
    const unsubscribe = listenToComments(category, postId, (newComments) => {
      setComments(newComments);
    });
    return () => unsubscribe();
  }, [category, postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      Toast.show({
        type: "error",
        text1: "Comment cannot be empty.",
      });
      return;
    }

    const cleanText = newComment.trim();

    if (filter.isProfane(cleanText)) {
      Toast.show({
        type: "error",
        text1: "Please remove inappropriate language before commenting.",
      });
      return;
    }

    try {
      setIsPosting(true);
      await createComment(category, postId, cleanText);
      setNewComment("");
      onCommentPosted?.();
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        300
      );
      Toast.show({
        type: "success",
        text1: "Comment posted successfully",
      });
    } catch (err) {
      console.error("Failed to post comment:", err);
      Toast.show({
        type: "error",
        text1: "Error posting comment",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const confirmDelete = (commentId: string) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteComment(commentId),
        },
      ]
    );
  };

  const deleteComment = async (commentId: string) => {
    try {
      await deleteDoc(
        doc(db, "discussions", category, "posts", postId, "comments", commentId)
      );

      const postRef = doc(db, "discussions", category, "posts", postId);
      await updateDoc(postRef, {
        commentCount: increment(-1),
      });

      onCommentPosted?.();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleReportComment = (comment: any) => {
    Alert.alert("Report Comment", `Report this comment by ${comment.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Report",
        style: "destructive",
        onPress: () => {
          // Placeholder for reporting logic (e.g. save to Firestore "reports")
          Toast.show({
            type: "success",
            text1: "Thanks, we'll review it shortly.",
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Image
              source={{
                uri:
                  item.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.commentBubble}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{item.name || "Anonymous"}</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {item.userId !== currentUid && (
                    <TouchableOpacity onPress={() => handleReportComment(item)}>
                      <Feather name="flag" size={16} color="#d9534f" />
                    </TouchableOpacity>
                  )}
                  {item.userId === currentUid && (
                    <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                      <Feather name="trash-2" size={16} color="#b92626" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() =>
          comments.length === 0 ? (
            <Text style={styles.empty}>No comments yet. Be the first!</Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      <View style={styles.commentContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Write a comment..."
          style={styles.input}
        />
        <Button
          onPress={handlePostComment}
          style={styles.button}
          disabled={!newComment.trim() || isPosting}
          labelStyle={{
            fontFamily: "Main-font",
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "none",
            color: "#000",
          }}
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    marginHorizontal: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: "#ddd",
  },
  commentBubble: {
    backgroundColor: "#f0ebff",
    borderRadius: 16,
    padding: 12,
    flex: 1,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#6b4c9a",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  empty: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginVertical: 14,
  },
  commentContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontFamily: "Main-font",
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 60,
  },
  button: {
    marginTop: 8,
    alignSelf: "flex-end",
    backgroundColor: "#c4b0fd",
    borderRadius: 8,
  },
});
