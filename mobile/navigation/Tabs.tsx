import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, HomeStackScreen } from "../screens/HomeScreen";
import { StyleSheet, View, Text } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import { WishListScreen } from "../screens/WishListScreen";
import { DetailScreen } from "../screens/DetailScreen";

const tabIcons: Record<string, string> = {
  Home: "home",
  WishList: "heart",
};

const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          const iconName = tabIcons[route.name] || "home";
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          height: 50,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStackScreen}></Tab.Screen>
      <Tab.Screen name="WishList" component={WishListScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7f5df0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
