import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterForm from './src/components/Registre';
import LoginForm from './src/components/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} options={{ title: "Connexion" }} />
        <Stack.Screen name="Register" component={RegisterForm} options={{ title: "Inscription" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
