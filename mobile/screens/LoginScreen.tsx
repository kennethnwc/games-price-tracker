import { StackNavigationProp } from "@react-navigation/stack";
import * as Google from "expo-google-app-auth";
import React from "react";
import { Button, View } from "react-native";
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
        iosClientId: `.com`,
        androidClientId: `.com`,
      });

      if (
        result.type === "success" &&
        result.accessToken &&
        result.refreshToken
      ) {
        // Then you can use the Google REST API
        await setTokens({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        console.log("LoginScreen.js 17 | success, navigating to profile");
        navigation.navigate("Profile", undefined);
      }
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
