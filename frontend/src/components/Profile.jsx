import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    number: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
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

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["token", "user"]);
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = () => {
    // For MVP, just toggle edit mode
    // In full version, this would call API to update user data
    Alert.alert("Succès", "Profil mis à jour (simulation)");
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.randomText}>
          Ierom uhguiughsfuh fiubfuubsf HIE fibdskbjkfbi ufud Yeaho! lerm
          uhguiughsfuh fiubfuubsflEHfib sG bjkfb ufud Yeah Hello!
        </Text>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete ur words</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>UserName</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={user.username}
          onChangeText={(text) => setUser({ ...user, username: text })}
          editable={isEditing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          editable={isEditing}
        />

        <Text style={styles.label}>Number</Text>
        <TextInput
          style={[styles.input, !isEditing && styles.disabledInput]}
          value={user.number}
          onChangeText={(text) => setUser({ ...user, number: text })}
          editable={isEditing}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value="••••••••••"
          editable={false}
        />

        {isEditing ? (
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={toggleEdit}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>logOut</Text>
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
  header: {
    marginTop: 80,
    marginBottom: 30,
  },
  randomText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: "#D70654",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "rgba(215, 6, 84, 0.1)",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "rgba(215, 6, 84, 0.05)",
    color: "#999",
  },
  updateButton: {
    backgroundColor: "rgba(215, 6, 84, 0.7)",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: "rgba(215, 6, 84, 0.7)",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  circle: {
    position: "absolute",
    bottom: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(215, 6, 84, 0.3)",
  },
});

export default Profile;
