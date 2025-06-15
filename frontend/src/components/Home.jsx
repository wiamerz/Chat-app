import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
    loadRooms();
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

  const loadRooms = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.11.107:3000/api/rooms/my-rooms",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRooms();
    setRefreshing(false);
  };

  const getRoomCardStyle = (room) => {
    // Different colors for rooms with new messages or recent activity
    const isRecent =
      new Date(room.lastMessage) > new Date(Date.now() - 30 * 60 * 1000); // 30 minutes
    return [
      styles.roomCard,
      isRecent ? styles.roomCardActive : styles.roomCardNormal,
    ];
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.username}>{user?.username || "User"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome to IwalIwn Chat!</Text>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => navigation.navigate("JoinRoom")}
        >
          <Text style={styles.joinButtonText}>Join Room</Text>
        </TouchableOpacity>
      </View>

      {/* Room List Section */}
      <View style={styles.roomSection}>
        <Text style={styles.sectionTitle}>Your Rooms</Text>

        {rooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No rooms yet. Create or join one!
            </Text>
          </View>
        ) : (
          rooms.map((room) => (
            <TouchableOpacity
              key={room._id}
              style={getRoomCardStyle(room)}
              onPress={() =>
                navigation.navigate("ChatRoom", {
                  roomId: room._id,
                  roomTitle: room.title,
                })
              }
            >
              <Text style={styles.roomTitle}>{room.title}</Text>
              <Text style={styles.roomCreator}>by {room.creator.username}</Text>
              <Text style={styles.roomMembers}>
                {room.members.length} members
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Create Room Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateRoom")}
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D70654",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: "#D70654",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  roomSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  roomCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  roomCardNormal: {
    backgroundColor: "rgba(215, 6, 84, 0.1)",
  },
  roomCardActive: {
    backgroundColor: "rgba(215, 6, 84, 0.2)",
    borderLeftWidth: 4,
    borderLeftColor: "#D70654",
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  roomCreator: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  roomMembers: {
    fontSize: 12,
    color: "#999",
  },
  emptyState: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
  createButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D70654",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  createButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default Home;
