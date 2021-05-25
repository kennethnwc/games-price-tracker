import { GoogleUser, LogInResult } from "expo-google-app-auth";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/core";

import { API_URL } from "../constants";
import { useTokenStore } from "../store/useTokenStore";

export type ProfileScreenParam = {
  Profile: { user: GoogleUser; result: LogInResult };
};

export const ProfileScreen = () => {
  const { accessToken, setTokens } = useTokenStore();

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const user = await fetch(API_URL + "/user/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json());
      console.log("Called", user);
      setUserInfo(user);
    })();
  }, [accessToken]);
  return (
    <View>
      <Text>Profile Screen</Text>
      <Text>
        {userInfo && userInfo.email && userInfo.googleID
          ? "You are Login ed"
          : "Loading"}
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
