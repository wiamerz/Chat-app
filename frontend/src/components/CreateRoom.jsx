import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Clipboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CreateRoom = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    if (!title.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un titre");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "http://192.168.11.107:3000/api/rooms/create",
        { title: title.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRoomCode(response.data.room.code);
      setShowModal(true);
    } catch (error) {
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Erreur lors de la création"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(roomCode);
    Alert.alert("Copié!", "Code copié dans le presse-papier");
  };

  const goToRoom = () => {
    setShowModal(false);
    navigation.replace("Home");
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
        Ready to start? Create a new room in seconds - just fill out the form
        and you're good to go! Then, share the code with your friends to join
        in.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Room Title</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Iwaliwan"
          value={title}
          onChangeText={setTitle}
          maxLength={50}
        />

        <Text style={styles.label}>Room Size</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value="5"
          editable={false}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreateRoom}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Room"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Room Created!</Text>
            <Text style={styles.modalText}>Your room code is:</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.roomCodeText}>{roomCode}</Text>
              <TouchableOpacity onPress={copyToClipboard}>
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtext}>
              Share this code with friends to let them join!
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={goToRoom}>
              <Text style={styles.modalButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  },
  disabledInput: {
    backgroundColor: "rgba(215, 6, 84, 0.05)",
    color: "#999",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D70654",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  roomCodeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D70654",
    marginRight: 15,
  },
  copyText: {
    color: "#D70654",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  modalSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#D70654",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CreateRoom;
