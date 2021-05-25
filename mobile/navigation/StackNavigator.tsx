import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image, Text, View } from "react-native";
import { DetailScreen } from "../screens/DetailScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ProfileScreen, ProfileScreenParam } from "../screens/ProfileScreen";
import { useTokenStore } from "../store/useTokenStore";

const Stack = createStackNavigator();

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: (props) => <Text>HELLO</Text> }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};

export type UserStackNavigatorParam = {
  Login: undefined;
  Profile: ProfileScreenParam["Profile"] | undefined;
};

export const UserStackNavigator = () => {
  const { accessToken, refreshToken } = useTokenStore();
  const initRoute = accessToken && refreshToken ? "Profile" : "Login";

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initRoute}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
};
