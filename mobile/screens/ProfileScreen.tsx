import { GoogleUser, LogInResult } from "expo-google-app-auth";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/core";

import { API_URL } from "../constants";
import { useTokenStore } from "../store/useTokenStore";

export type ProfileScreenParam = {
  Profile: { user: GoogleUser; result: LogInResult };
};

export const ProfileScreen = () => {
  const { accessToken, setTokens, refreshToken } = useTokenStore();

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const decodedAccessToken = jwtDecode<{ exp: number }>(accessToken);
      const decodedRefreshToken = jwtDecode<{ exp: number }>(refreshToken);
      if (decodedAccessToken.exp < Date.now() / 1000) {
        const newAccessToken = await fetch(API_URL + "/user/token", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ token: refreshToken }),
        }).then((r) => r.json());
        setTokens({
          accessToken: newAccessToken.accessToken,
          refreshToken: refreshToken,
        });
      }
      const user = await fetch(API_URL + "/user/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json());
      setUserInfo(user);
    })();
  }, [accessToken]);
  return (
    <View>
      <Text>Profile Screen</Text>
      <Text>
        {userInfo && userInfo.email && userInfo.googleID
          ? `You are Login as ${userInfo.email}`
          : "You are not Login in"}
      </Text>
      {userInfo && userInfo.email ? (
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
      ) : (
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      )}
    </View>
  );
};
