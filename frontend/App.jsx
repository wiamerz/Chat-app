import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterForm from './src/components/Registre';
import LoginForm from './src/components/Login';
import Home from './src/components/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterForm} options={{ title: "Inscription" }} />
        <Stack.Screen name="Login" component={LoginForm} options={{ title: "Connexion" }} />
        <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
