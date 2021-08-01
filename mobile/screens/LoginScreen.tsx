import * as Google from "expo-google-app-auth";
import React from "react";
import { Button, Platform, StyleSheet, View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";

import {
  AN_CLIENT_ID,
  AN_STANDALONE_ID,
  API_URL,
  IOS_CLIENT_ID,
} from "../constants";
import { UserStackNavigatorParam } from "../navigation/StackNavigator";
import { useExpoPushToken } from "../store/useExpoPushTokenStore";
import { useTokenStore } from "../store/useTokenStore";
import { Layout } from "../ui/Layout";

type LoginScreenProps = {
  navigation: StackNavigationProp<UserStackNavigatorParam, "Login">;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { setTokens } = useTokenStore();
  const { expoPushToken } = useExpoPushToken();
  const signInAsync = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        androidClientId: AN_CLIENT_ID,
        androidStandaloneAppClientId: AN_STANDALONE_ID,
      });

      if (
        result.type === "success" &&
        result.accessToken &&
        result.refreshToken
      ) {
        const data = await fetch(API_URL + "/user/login", {
          body: JSON.stringify({ expo_push_token: expoPushToken }),
          method: "POST",
          headers: {
            Authorization: `Bearer ${result.idToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((r) => r.json())
          .catch(() => null);
        await setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        navigation.replace("Profile", undefined);
      }
    } catch (error) {}
  };
  return (
    <Layout>
      <View style={styles.container}>
        {Platform.OS === "ios" ? (
          <Button
            color="#50e2e4"
            title="Login with Google"
            onPress={signInAsync}
          />
        ) : (
          <Button
            color="#12728f"
            title="Login with Google"
            onPress={signInAsync}
          />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignContent: "center",
    alignItems: "center",
  },
});
