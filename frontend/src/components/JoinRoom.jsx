import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const JoinRoom = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [roomPreview, setRoomPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCodeChange = async (text) => {
    setCode(text.toUpperCase());

    if (text.length === 8) {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `http://192.168.11.107:3000/api/rooms/preview/${text.toUpperCase()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRoomPreview(response.data);
      } catch (error) {
        setRoomPreview(null);
      }
    } else {
      setRoomPreview(null);
    }
  };

  const handleJoinRoom = async () => {
    if (!code || code.length !== 8) {
      Alert.alert("Erreur", "Veuillez entrer un code valide");
      return;
    }

    setJoining(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        "http://192.168.11.107:3000/api/rooms/join",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Succès!", "Vous avez rejoint la room", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de rejoindre la room"
      );
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Got a key from your friend? Type it in to join the room and enjoy the
        fun! Remember, the key is private - it's your choice if you want to
        share it.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Room Key</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: IWALIWAN129"
          value={code}
          onChangeText={handleCodeChange}
          maxLength={8}
          autoCapitalize="characters"
        />

        {roomPreview && (
          <View style={styles.previewContainer}>
            <Text style={styles.label}>Room Title</Text>
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>{roomPreview.title}</Text>
              <Text style={styles.previewDetails}>
                by {roomPreview.creator} • {roomPreview.memberCount}/
                {roomPreview.maxMembers} members
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!roomPreview || joining) && styles.buttonDisabled,
          ]}
          onPress={handleJoinRoom}
          disabled={!roomPreview || joining}
        >
          <Text style={styles.buttonText}>
            {joining ? "Joining..." : "Join Room"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.circle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  closeText: {
    fontSize: 24,
    color: "#666",
  },
  title: {
    fontSize: 16,
    color: "#666",
    marginTop: 80,
    marginBottom: 40,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    fontSize: 16,
    letterSpacing: 2,
  },
  previewContainer: {
    marginBottom: 25,
  },
  previewBox: {
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  previewDetails: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "rgba(215, 6, 84, 0.7)",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  circle: {
    position: "absolute",
    bottom: -100,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(215, 6, 84, 0.3)",
  },
});

export default JoinRoom;
