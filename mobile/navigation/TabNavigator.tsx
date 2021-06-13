import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  HomeStackNavigator,
  SearchStackNavigator,
  UserStackNavigator,
  WishListStackNavigator,
} from "./StackNavigator";

const tabIcons: Record<string, string> = {
  Home: "tag",
  WishList: "heart",
  User: "user",
  Search: "search1",
};

const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            // You can return any component that you like here!
            const iconName = tabIcons[route.name] || "tag";
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          showLabel: true,
        }}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator}></Tab.Screen>
        <Tab.Screen name="Search" component={SearchStackNavigator}></Tab.Screen>
        <Tab.Screen
          name="WishList"
          component={WishListStackNavigator}
        ></Tab.Screen>
        <Tab.Screen name="User" component={UserStackNavigator}></Tab.Screen>
      </Tab.Navigator>
    </View>
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
