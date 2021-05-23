import { useNavigation, useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { GoogleUser, LogInResult } from "expo-google-app-auth";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useTokenStore } from "../store/useTokenStore";

export type ProfileScreenParam = {
  Profile: { user: GoogleUser; result: LogInResult };
};

export const ProfileScreen = () => {
  const { accessToken, refreshToken, setTokens } = useTokenStore();

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<LogInResult | null>(null);
  console.log({ accessToken, refreshToken });
  return (
    <View>
      <Text>Profile Screen</Text>
      <Text>
        {!userInfo || userInfo.type === "cancel"
          ? "Please Login"
          : `Welcome ${userInfo.user.name}`}
      </Text>
      <Button
        title="Logout"
        onPress={async () => {
          try {
            await setTokens({ accessToken: "", refreshToken: "" });
            setUserInfo(null);
            navigation.navigate("Login");
          } catch (e) {}
        }}
      ></Button>
    </View>
  );
};
