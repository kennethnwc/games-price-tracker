import "react-native-gesture-handler";

import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { Tabs } from "./navigation/Tabs";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const App = () => {
  const scheme = useColorScheme();
  return (
    <AppearanceProvider>
      <NavigationContainer
      // theme={scheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Tabs />
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export default App;
