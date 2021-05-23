import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import "react-native-gesture-handler";
import { Tabs } from "./navigation/TabNavigator";

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
