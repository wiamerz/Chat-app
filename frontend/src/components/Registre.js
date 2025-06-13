import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegisterForm = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    number: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const phoneRegex = /^\+?[0-9]{10,15}$/;

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Ce champ est obligatoire';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!phoneRegex.test(formData.number)) {
      newErrors.number = 'Numéro de téléphone invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Au moins 6 caractères requis';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post('http://127.0.0.1:3000/api/auth/register', formData);

        if (response.status === 201) {
          Alert.alert('Succès', 'Inscription réussie ! Vérifiez votre email pour continuer.');
          navigation.navigate('Verification', { email: formData.email });
        } else {
          Alert.alert('Erreur', response.data.message || 'Une erreur est survenue');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
        Alert.alert('Erreur', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      {Object.entries({
        username: 'Nom d\'utilisateur',
        email: 'Email',
        number: 'Numéro de téléphone',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
      }).map(([key, label]) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            secureTextEntry={key.includes('password')}
            style={[styles.input, errors[key] && styles.inputError]}
            value={formData[key]}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={label}
          />
          {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00000',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#00000',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(215, 6, 84, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: 'rgba(215, 6, 84, 1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RegisterForm;
