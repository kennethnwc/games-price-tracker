import "react-native-gesture-handler";

import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { NativeEventSubscription } from "react-native";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import { NavigationContainer, DarkTheme } from "@react-navigation/native";

import { Tabs } from "./navigation/TabNavigator";
import { useExpoPushToken } from "./store/useExpoPushTokenStore";
import { useTokenStore } from "./store/useTokenStore";
import { registerForPushNotificationsAsync } from "./utils/registerForPushNotificationsAsync";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const scheme = useColorScheme();
  const tokenStore = useTokenStore();
  const isTokenStoreReady = useTokenStore(
    (s) => s.accessToken !== undefined && s.refreshToken !== undefined
  );

  const { setExpoPushToken } = useExpoPushToken();

  const [notification, setNotification] =
    useState<Notifications.Notification | boolean>(false);
  const notificationListener = useRef<NativeEventSubscription>();
  const responseListener = useRef<NativeEventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token || "")
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  useEffect(() => {
    tokenStore.loadTokens();
  }, [isTokenStoreReady]);

  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
      }}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppearanceProvider>
          <StatusBar style="light" />
          <Tabs />
        </AppearanceProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
