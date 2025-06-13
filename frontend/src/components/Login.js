import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {View, Text, TextInput, TouchableOpacity,StyleSheet, ScrollView, Alert, ActivityIndicator} from 'react-native';

const LoginForm = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Ce champ est obligatoire';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format invalide';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Ce champ est obligatoire';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setApiError('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.token) {
        const { token, user } = response.data;

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        Alert.alert("Connexion réussie");

        setTimeout(() => {
          navigation.navigate('Home');
        }, 2000);
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {['email', 'password'].map((key) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key === 'email' ? 'Email' : 'Mot de passe'}</Text>
          <TextInput
            secureTextEntry={key === 'password'}
            style={[styles.input, errors[key] && styles.inputError]}
            value={formData[key]}
            onChangeText={(text) => handleChange(key, text)}
            placeholder={key === 'email' ? 'ex: test@email.com' : 'Votre mot de passe'}
          />
          {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
        </View>
      ))}

      {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
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

export default LoginForm;
