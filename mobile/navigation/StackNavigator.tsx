import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { DetailScreen } from "../screens/DetailScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ProfileScreen, ProfileScreenParam } from "../screens/ProfileScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { WishListScreen } from "../screens/WishListScreen";
import { useTokenStore } from "../store/useTokenStore";

const Stack = createStackNavigator();

export type DetailsItemListStackNavigatorParams = {
  Detail: { store_id: string; title: string; image_url: string };
};

export const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "On Sale" }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
};
export type WishListStackNavigatorParam = {
  WishList: undefined;
  Detail: undefined;
  Login: undefined;
};

export const WishListStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WishList"
        component={WishListScreen}
        options={{ title: "Wish List" }}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};
export const SearchStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Search" }}
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
    <Stack.Navigator initialRouteName={initRoute}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "User and Setting" }}
      />
    </Stack.Navigator>
  );
};
