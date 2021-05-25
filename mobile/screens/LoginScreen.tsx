import * as Google from "expo-google-app-auth";
import React from "react";
import { Button, View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";

import { AN_CLIENT_ID, API_URL, IOS_CLIENT_ID } from "../constants";
import { UserStackNavigatorParam } from "../navigation/StackNavigator";
import { useTokenStore } from "../store/useTokenStore";

type LoginScreenProps = {
  navigation: StackNavigationProp<UserStackNavigatorParam, "Login">;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { setTokens, refreshToken } = useTokenStore();
  const signInAsync = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        androidClientId: AN_CLIENT_ID,
      });

      if (
        result.type === "success" &&
        result.accessToken &&
        result.refreshToken
      ) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${result.idToken}`);
        const data = await fetch(API_URL + "/user/login", {
          headers: headers,
        })
          .then((r) => r.json())
          .catch(() => null);
        await setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        navigation.navigate("Profile", undefined);
      }
    } catch (error) {}
  };
  return (
    <View>
      <Button title="Login with Google" onPress={signInAsync} />
      {refreshToken ? (
        <Button
          title="Profile"
          onPress={() => {
            navigation.navigate("Profile", undefined);
          }}
        />
      ) : null}
    </View>
  );
};
