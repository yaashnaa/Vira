import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from "react-native";
import { Dialog } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { ScrollView } from "react-native-gesture-handler";
import { Modal, Portal, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { db, auth } from "@/config/firebaseConfig";
import { Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  collectionGroup,
  writeBatch,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import Toast from "react-native-toast-message";
import CommentSection from "@/components/community/commentSection";
import { createPost } from "@/utils/community";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  const [postText, setPostText] = useState("");
  const [infoVisible, setInfoVisible] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>("All");
  const [posts, setPosts] = useState<any[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [posting, setPosting] = useState(false);

  const TAG_OPTIONS = [
    "All",
    "General",
    "Wellness Tips",
    "Advice",
    "Motivation",
    "Questions",
  ];
  const openPost = async () => {
    const acknowledged = await AsyncStorage.getItem("hasAcknowledgedRules");
    if (acknowledged) {
      setIsPostModalVisible(true);
    } else {
      setShowRulesModal(true);
    }
  };
  useEffect(() => {
    const checkWelcomeSeen = async () => {
      const seen = await AsyncStorage.getItem("hasSeenCommunityWelcome");
      if (!seen) {
        setShowWelcomeModal(true);
      }
    };
    checkWelcomeSeen();
  }, []);

  const handleAcknowledgeRules = async () => {
    await AsyncStorage.setItem("hasAcknowledgedRules", "true");
    setShowRulesModal(false);
    setIsPostModalVisible(true);
  };
  const handleDismissWelcome = async () => {
    await AsyncStorage.setItem("hasSeenCommunityWelcome", "true");
    setShowWelcomeModal(false);
  };

  useEffect(() => {
    const collectionRef =
      filterTag === "All"
        ? collectionGroup(db, "posts")
        : collection(db, "discussions", filterTag, "posts");

    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map((doc) => {
        const postData = doc.data();
        const createdAt = postData.timestamp?.toDate
          ? postData.timestamp.toDate()
          : new Date(postData.timestamp || Date.now());

        let tagFromPath = filterTag;
        if (filterTag === "All") {
          const pathParts = doc.ref.path.split("/");
          tagFromPath = pathParts[1];
        }

        return {
          id: doc.id,
          ...postData,
          createdAt,
          commentCount: postData.commentCount ?? 0,
          tag: tagFromPath,
        };
      });
      setPosts(loadedPosts);
    });

    return unsubscribe;
  }, [filterTag]);
  const handleTagChange = (newTag: string, postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === postId ? { ...p, tag: newTag } : p))
    );
  };

  const handlePostSubmit = async () => {
    if (!selectedTag || !postText.trim()) {
      Toast.show({
        type: "error",
        text1: "Please select a tag and write something!",
      });
      return;
    }
    try {
      setPosting(true);
      await createPost(selectedTag, postText.trim(), selectedTag);
      Toast.show({ type: "success", text1: "Post shared 🎉" });
      setPostText("");
      setSelectedTag(null);
      setIsPostModalVisible(false);
    } catch (error) {
      console.error(error);
      Toast.show({ type: "error", text1: "Failed to create post" });
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPostId(post.id);
    setEditedText(post.text || "");
  };

  const handleSaveEdit = async (postId: string, currentTag: string) => {
    const postToUpdate = posts.find((p) => p.id === postId);
    if (!postToUpdate) return;

    await updateDoc(doc(db, "discussions", postToUpdate.tag, "posts", postId), {
      text: editedText.trim(),
      tag: postToUpdate.tag, // 🔥 new tag
    });
    setEditingPostId(null);
    setEditedText("");
  };

  const handleDelete = async (post: any) => {
    Alert.alert("Delete Post", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const commentsRef = collection(
            db,
            "discussions",
            post.tag,
            "posts",
            post.id,
            "comments"
          );
          const commentsSnapshot = await getDocs(commentsRef);
          const batch = writeBatch(db);

          commentsSnapshot.forEach((docSnap) => {
            batch.delete(docSnap.ref);
          });

          await batch.commit();
          await deleteDoc(doc(db, "discussions", post.tag, "posts", post.id));
          Toast.show({ type: "success", text1: "Post deleted!" });
        },
      },
    ]);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#eee",
              margin: 20,
              borderRadius: 10,
            }}
            onPress={async () => {
              await AsyncStorage.removeItem("hasSeenCommunityWelcome");
              alert("Welcome flag reset! Restart app to test 🎯");
            }}
          >
            <Text>Reset Welcome Modal</Text>
          </TouchableOpacity> */}

          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TAG_OPTIONS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    { marginRight: 20 },
                    styles.tagButton,
                    filterTag === tag && styles.tagButtonSelected,
                  ]}
                  onPress={() => setFilterTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagButtonText,
                      filterTag === tag && styles.tagButtonTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Posts */}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No posts yet. Be the first!
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              // ✅ Check if this is the user's first post
              const userPosts = posts.filter(
                (p) => p.userId === auth.currentUser?.uid
              );
              const sortedUserPosts = [...userPosts].sort(
                (a, b) => a.createdAt - b.createdAt
              );
              const firstPostId = sortedUserPosts[0]?.id;
              const isFirstPostByUser = item.id === firstPostId;

              return (
                <View style={styles.post}>
                  {editingPostId === item.id ? (
                    <>
                      <TextInput
                        value={editedText}
                        onChangeText={setEditedText}
                        style={styles.input}
                        multiline
                      />

                      {/* Tag Selector while editing */}
                      <View style={styles.tagSelector}>
                        {TAG_OPTIONS.filter((t) => t !== "All").map((tag) => (
                          <TouchableOpacity
                            key={tag}
                            style={[
                              styles.tagButton,
                              item.tag === tag && styles.tagButtonSelected,
                            ]}
                            onPress={() => handleTagChange(tag, item.id)}
                          >
                            <Text
                              style={[
                                styles.tagButtonText,
                                item.tag === tag &&
                                  styles.tagButtonTextSelected,
                              ]}
                            >
                              {tag}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          handleSaveEdit(item.id, item.tag ?? "General")
                        }
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* Avatar + Username */}
                      <View style={styles.Avatarcontainer}>
                        <Avatar.Image
                          size={40}
                          source={{
                            uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                          }}
                        />
                        <View style={styles.meta}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text style={styles.author}>
                              Posted by {item.name}
                            </Text>

                            {/* ✅ Show info button ONLY if it's the user's first post */}
                            {isFirstPostByUser && (
                              <TouchableOpacity
                                onPress={() => setInfoVisible(true)}
                              >
                                <Feather
                                  name="info"
                                  size={16}
                                  color="#888"
                                  style={{ marginLeft: 6 }}
                                />
                              </TouchableOpacity>
                            )}
                          </View>

                          <Text style={styles.time}>
                            {formatDistanceToNow(item.createdAt, {
                              addSuffix: true,
                            })}
                          </Text>
                        </View>
                      </View>

                      {/* Post Text */}
                      <Text style={styles.postText}>{item.text}</Text>
                    </>
                  )}

                  {/* Edit/Delete Buttons (only if not editing) */}
                  {item.userId === auth.currentUser?.uid &&
                    editingPostId !== item.id && (
                      <View style={styles.actions}>
                        <TouchableOpacity onPress={() => handleEdit(item)}>
                          <Feather name="edit" size={20} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                          <Feather name="trash-2" size={21} color="#b92626" />
                        </TouchableOpacity>
                      </View>
                    )}

                  {/* Comments Button */}
                  <TouchableOpacity
                    onPress={() =>
                      setActivePostId(activePostId === item.id ? null : item.id)
                    }
                  >
                    <View style={styles.commentRow}>
                      <MaterialCommunityIcons
                        name="comment-outline"
                        size={18}
                        color="#007bff"
                      />
                      <Text style={styles.commentText}>
                        {item.commentCount ?? 0} Comments
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Comment Section if expanded */}
                  {activePostId === item.id && (
                    <View style={styles.commentSection}>
                      <CommentSection
                        category={item.tag ?? "General"}
                        postId={item.id}
                      />
                    </View>
                  )}
                </View>
              );
            }}
          />

          {/* FAB to open post modal */}
          <TouchableOpacity style={styles.fab} onPress={openPost}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>

          <Portal>
            <Modal
              visible={isPostModalVisible}
              onDismiss={() => setIsPostModalVisible(false)}
              contentContainerStyle={styles.modalBox} // custom popup styling
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <LottieView
                    source={require("@/assets/animations/post.json")}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200, alignSelf: "center" }}
                  />
                  <TextInput
                    placeholder="Write something..."
                    value={postText}
                    onChangeText={setPostText}
                    multiline
                    style={styles.input}
                  />
                  <View style={styles.tagSelector}>
                    {TAG_OPTIONS.filter((t) => t !== "All").map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tagButton,
                          selectedTag === tag && styles.tagButtonSelected,
                        ]}
                        onPress={() => setSelectedTag(tag)}
                      >
                        <Text
                          style={[
                            styles.tagButtonText,
                            selectedTag === tag && styles.tagButtonTextSelected,
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Button
                    mode="contained"
                    onPress={handlePostSubmit}
                    style={{ marginTop: 10, backgroundColor: "#ac91d4" }}
                  >
                    {posting ? "Posting..." : "Post"}
                  </Button>
                  <Button
                    mode="text"
                    onPress={() => setIsPostModalVisible(false)}
                    textColor="#f44336"
                    style={{ marginTop: 10, width: "35%", alignSelf: "center" }}
                  >
                    Cancel
                  </Button>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </Portal>
          <Portal>
            <Dialog
              visible={infoVisible}
              onDismiss={() => setInfoVisible(false)}
              style={{
                backgroundColor: "#fdfaff", // very light lavender-white
                borderRadius: 16,
              }}
            >
              <Dialog.Title
                style={{ color: "#6b4c9a", fontWeight: "bold", fontSize: 20 }}
              >
                Username Info
              </Dialog.Title>
              <Dialog.Content>
                <Text
                  style={{ fontSize: 14, color: "#555", textAlign: "center" }}
                >
                  This is an auto-generated username for privacy. You can
                  customize it later in Settings!
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setInfoVisible(false)}
                  textColor="#6b4c9a"
                >
                  Got it
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Portal>
            <Modal
              visible={showRulesModal}
              onDismiss={() => setShowRulesModal(false)}
              contentContainerStyle={styles.respectModal}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={styles.respectEmoji}>🛡️</Text>
                <Text style={styles.respectTitle}>Community Guidelines</Text>
                <Text style={styles.respectText}>
                  Please be respectful, supportive, and kind. Avoid sharing
                  personal information like your phone number, address, or full
                  name. Let's keep our community safe and welcoming! 🤝
                </Text>

                <Button
                  mode="contained"
                  onPress={handleAcknowledgeRules}
                  style={styles.respectButton}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  I Understand
                </Button>
              </View>
            </Modal>
          </Portal>
          <Portal>
            <Modal
              visible={showWelcomeModal}
              onDismiss={handleDismissWelcome}
              contentContainerStyle={styles.welcomeModal}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={styles.welcomeEmoji}>🌟</Text>
                <Text style={styles.welcomeTitle}>
                  Welcome to the Community!
                </Text>
                <Text style={styles.welcomeText}>
                  This is a supportive space where you can share your thoughts,
                  tips, and questions freely. Be respectful, be kind, and enjoy
                  being part of something meaningful. 💬✨
                </Text>

                <Button
                  mode="contained"
                  onPress={handleDismissWelcome}
                  style={styles.welcomeButton}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  Let's Go!
                </Button>
              </View>
            </Modal>
          </Portal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    textAlignVertical: "top",
    height: 120,
  },
  button: {
    backgroundColor: "#6b4c9a",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  post: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  postText: { fontSize: 16, marginBottom: 8 },
  tagButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 8,
  },
  tagButtonSelected: { backgroundColor: "#c4b0fd" },
  tagButtonText: { fontSize: 14, color: "#6b4c9a" },
  tagButtonTextSelected: { color: "#fff", fontWeight: "bold" },
  Avatarcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginRight: 10,
  },
  meta: {
    display: "flex",
    marginLeft: 10,
    marginTop: 5,
    flexDirection: "column",
  },
  author: {
    color: "#777",
    fontSize: 12,
  },
  time: {
    color: "#aaa",
    fontSize: 12,
  },
  fab: {
    backgroundColor: "#6b4c9a",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 30,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { color: "#fff", fontSize: 30 },
  modalContent: {
    flex: 1,
    padding: 20,
    width: "100%",
    marginTop: 50,
    height: height * 0.5,
  },
  filterRow: { paddingHorizontal: 10, marginVertical: 10 },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 16, color: "#777" },
  commentButton: { color: "#007bff", marginTop: 10 },
  commentSection: { marginTop: 10 },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    bottom: 85,
    left: 310,
    gap: 10,
  },
  actionButton: { color: "#FF6B6B", marginHorizontal: 10, fontWeight: "bold" },
  tagSelector: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentText: {
    color: "#007bff",
    fontSize: 14,
    marginLeft: 5,
    fontFamily: "Main-font",
  },

  filterTag: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  infoModal: {
    backgroundColor: "white",
    margin: 30,
    borderRadius: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6b4c9a",
    textAlign: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  respectModal: {
    backgroundColor: "#ffffff",
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  respectEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  respectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5c469c",
    marginBottom: 10,
    fontFamily: "Main-font",
    textAlign: "center",
  },
  respectText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Main-font",
  },
  respectButton: {
    backgroundColor: "#c3a5f1",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 12,
  },
  welcomeModal: {
    backgroundColor: "#ffffff",
    padding: 24,
    margin: 20,
    borderRadius: 20,
  },
  welcomeEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5c469c",
    marginBottom: 10,
    fontFamily: "Main-font",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Main-font",
  },
  welcomeButton: {
    backgroundColor: "#c3a5f1",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
