import "react-native-gesture-handler";

import React, { useEffect } from "react";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";

import { NavigationContainer } from "@react-navigation/native";

import { Tabs } from "./navigation/TabNavigator";
import { useTokenStore } from "./store/useTokenStore";

const App = () => {
  const scheme = useColorScheme();
  const tokenStore = useTokenStore();
  const isTokenStoreReady = useTokenStore(
    (s) => s.accessToken !== undefined && s.refreshToken !== undefined
  );

  if (!isTokenStoreReady) {
    tokenStore.loadTokens();
  }
  useEffect(() => {}, [isTokenStoreReady]);

  // console.log("App.tsx tokenStore", tokenStore);

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
