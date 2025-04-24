import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { Icon } from "@rneui/themed";
import { createPost, listenToPosts } from "@/utils/community";
import DiscussionCard from "@/components/community/discussionCard";
import CommentSection from "@/components/community/commentSection";

export default function WinsTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = listenToPosts("Wins", setPosts);
    return unsubscribe;
  }, []);

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await createPost("Wins", newPost.trim());
      setNewPost("");
    } catch (error) {
      console.error("❌ Failed to post:", error);
    }
  };
  const toggleComments = (postId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>🎉 Wins & Small Victories</Text>
              <Text style={styles.infoText}>
                Celebrate your progress — however small. This space is for gratitude, confidence, and kindness.
              </Text>
            </Card.Content>
          </Card>
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.author}>Posted by {item.name}</Text>
            <DiscussionCard post={item} category="Wins" />

            <TouchableOpacity onPress={() => toggleComments(item.id)} style={styles.commentButton}>
              <Icon name="message-circle" type="feather" size={18} color="#865dff" />
              <Text style={styles.commentButtonText}>Comment</Text>
            </TouchableOpacity>

            {visibleComments[item.id] && (
              <CommentSection category="Wins" postId={item.id}     onCommentPosted={() => toggleComments(item.id)}/>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No wins yet. Be the first to share!</Text>
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Celebrate your win..."
        value={newPost}
        onChangeText={setNewPost}
      />
      <Button
        mode="contained"
        onPress={handleAddPost}
        style={styles.button}
        disabled={!newPost.trim()}
      >
        Post
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff0f6", flex: 1 },
  postCard: {
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    fontFamily: "Main-font",
    marginTop: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#865dff",
    borderRadius: 8,
  },
  author: {
    fontSize: 12,
    color: "#6a6a6a",
    fontFamily: "Main-font",
    marginBottom: 6,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f3e9ff",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  commentButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6b4c9a",
    fontFamily: "PatrickHand-Regular",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#aaa",
    fontFamily: "Main-font",
  },
  infoCard: {
    backgroundColor: "#e9f6ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: "PatrickHand-Regular",
    color: "#2a628f",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Main-font",
    color: "#3c3c3c",
    lineHeight: 18,
  },
});
