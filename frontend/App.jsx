import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RegisterForm from "./src/components/Registre";
import LoginForm from "./src/components/Login";
import Home from "./src/components/Home";
import CreateRoom from "./src/components/CreateRoom";
import JoinRoom from "./src/components/JoinRoom";
import ChatRoom from "./src/components/ChatRoom";
import Profile from "./src/components/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("Login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setInitialRoute(token ? "Home" : "Login");
    } catch (error) {
      console.error("Auth check error:", error);
      setInitialRoute("Login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Register" component={RegisterForm} />
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateRoom" component={CreateRoom} />
        <Stack.Screen name="JoinRoom" component={JoinRoom} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
