import React from "react";
import { View } from "react-native";
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
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            // You can return any component that you like here!
            const iconName = tabIcons[route.name] || "tag";
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          style: {
            borderTopWidth: 1,
          },
          showLabel: false,
          activeTintColor: "#5bd3c9",
        }}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Search" component={SearchStackNavigator} />
        <Tab.Screen name="WishList" component={WishListStackNavigator} />
        <Tab.Screen name="User" component={UserStackNavigator} />
      </Tab.Navigator>
    </View>
  );
};
