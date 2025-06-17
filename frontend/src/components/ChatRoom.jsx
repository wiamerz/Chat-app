import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";

const ChatRoom = ({ route, navigation }) => {
  const { roomId, roomTitle } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const scrollViewRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    loadUserData();
    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      socketRef.current = io("http://192.168.11.107:3000", {
        auth: { token },
      });

      socketRef.current.emit("join-room", roomId);

      socketRef.current.on("room-members", (memberList) => {
        setMembers(memberList);
      });

      socketRef.current.on("previous-messages", (messageList) => {
        setMessages(messageList);
      });

      socketRef.current.on("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socketRef.current.on("user-joined", (data) => {
        setMembers(data.members);
      });

      socketRef.current.on("user-left", (data) => {
        setMembers(data.members);
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("send-message", {
      roomId,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", roomId);
    }
    navigation.goBack();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={leaveRoom}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.memberIndicators}>
            {members.slice(0, 3).map((member, index) => (
              <View key={member._id} style={styles.memberDot}>
                <Text style={styles.memberText}>
                  {member.username === user?.username ? "You" : member.username}
                </Text>
              </View>
            ))}
            {members.length > 3 && (
              <Text style={styles.moreMembers}>+{members.length - 3}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.leaveButton} onPress={leaveRoom}>
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
      >
        {messages.map((message, index) => (
          <View key={index} style={styles.messageGroup}>
            <View style={styles.memberIndicator}>
              <Text style={styles.memberName}>
                {message.sender.username === user?.username
                  ? "You"
                  : message.sender.username}
              </Text>
            </View>
            <View
              style={[
                styles.messageBubble,
                message.sender.username === user?.username
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.content}</Text>
              <Text style={styles.messageTime}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeText: {
    fontSize: 24,
    color: "#666",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  memberIndicators: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberDot: {
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  memberText: {
    fontSize: 12,
    color: "#D70654",
    fontWeight: "bold",
  },
  moreMembers: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  leaveButton: {
    backgroundColor: "#D70654",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  leaveButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageGroup: {
    marginBottom: 15,
  },
  memberIndicator: {
    marginBottom: 5,
  },
  memberName: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
  },
  myMessage: {
    backgroundColor: "#D70654",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    alignItems: "flex-end",
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 20,
  },
});

export default ChatRoom;
