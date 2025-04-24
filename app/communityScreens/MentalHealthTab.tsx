import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { Icon } from "@rneui/themed";
import DiscussionCard from "@/components/community/discussionCard";
import CommentSection from "@/components/community/commentSection";
import { createPost, listenToPosts } from "@/utils/community";

export default function MentalHealthTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [visibleComments, setVisibleComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = listenToPosts("Mental Health", setPosts);
    return unsubscribe;
  }, []);

  const handlePost = async () => {
    await createPost("Mental Health", newPost);
    setNewPost("");
  };

  const toggleComments = (postId: string) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };
  return (
    <View style={styles.container}>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>🧠 Mental Health Space</Text>
              <Text style={styles.infoText}>
                A safe place to share how you're feeling and connect with others.
                Please be supportive and kind.
              </Text>
            </Card.Content>
          </Card>
        }
        renderItem={({ item }) => (
          <View style={styles.postBlock}>
            <Text style={styles.author}>Posted by {item.name}</Text>
            <DiscussionCard post={item} category="Mental Health" />
            <TouchableOpacity
              onPress={() => toggleComments(item.id)}
              style={styles.commentButton}
            >
              <Icon name="message-circle" type="feather" size={18} color="#865dff" />
              <Text style={styles.commentButtonText}>Comment</Text>
            </TouchableOpacity>
            {visibleComments[item.id] && (
              <CommentSection category="Mental Health" postId={item.id}  onCommentPosted={() => toggleComments(item.id)} />
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet.</Text>}
      />

      <TextInput
        value={newPost}
        onChangeText={setNewPost}
        placeholder="Start a discussion..."
        style={styles.input}
      />
      <Button mode="contained" onPress={handlePost} style={styles.button}>
        Post
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff0f6", flex: 1 },
  infoCard: {
    backgroundColor: "#f9e8ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: "PatrickHand-Regular",
    color: "#3e2a6e",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Main-font",
    color: "#4a4a4a",
    lineHeight: 18,
  },
  postBlock: {
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
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    fontFamily: "Main-font",
    fontSize: 14,
    marginTop: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#865dff",
    borderRadius: 8,
  },
});
