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
  const { setTokens } = useTokenStore();
  const signInAsync = async () => {
    console.log("LoginScreen.js 6 | loggin in");
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
        console.log(data);
        await setTokens({
          accessToken: data.accessToken,
          refreshToken: "",
        });
        navigation.navigate("Profile", undefined);
      }
      console.log("LoginScreen.js 17 | success, navigating to profile");
    } catch (error) {
      console.log("LoginScreen.js 19 | error with login", error);
    }
  };

  return (
    <View>
      <Button title="Login with Google" onPress={signInAsync} />
      <Button
        title="Profile"
        onPress={() => {
          navigation.navigate("Profile", undefined);
        }}
      ></Button>
    </View>
  );
};
