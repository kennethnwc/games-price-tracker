import { GoogleUser, LogInResult } from "expo-google-app-auth";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/core";

import { API_URL } from "../constants";
import { useTokenStore } from "../store/useTokenStore";
import { Layout } from "./Layout";

import axios from "axios";

export type ProfileScreenParam = {
  Profile: { user: GoogleUser; result: LogInResult };
};

export const ProfileScreen = () => {
  const { accessToken, setTokens, refreshToken } = useTokenStore();

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  console.log({ accessToken, refreshToken });
  useEffect(() => {
    setLoading(true);
    const fetchUserInfo = async () => {
      const response = await axios.get(API_URL + "/user/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("fetch result", response.data);
      setUserInfo(response.data);
    };
    fetchUserInfo();
    // (async () => {
    //   setLoading(true);
    //   const decodedAccessToken = jwtDecode<{ exp: number }>(accessToken!);
    //   const decodedRefreshToken = jwtDecode<{ exp: number }>(refreshToken!);
    //   console.log("Profile useEffect 1");
    //   if (decodedAccessToken.exp < Date.now() / 1000) {
    //     const newAccessToken = await fetch(API_URL + "/user/token", {
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //       },
    //       method: "POST",
    //       body: JSON.stringify({ token: refreshToken }),
    //     }).then((r) => r.json());
    //     setTokens({
    //       accessToken: newAccessToken.accessToken,
    //       refreshToken: refreshToken!,
    //     });
    //   }
    //   const user = await fetch(API_URL + "/user/profile", {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   }).then((r) => r.json());
    //   setUserInfo(user);
    //   setLoading(false);
    // })();

    setLoading(false);
  }, []);

  if (isLoading) return <ActivityIndicator />;
  return (
    <Layout>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.userInfo}>
        {userInfo && userInfo.email && userInfo.googleID
          ? `${userInfo.email}`
          : "You are not Login in"}
      </Text>
      {userInfo && userInfo.email ? (
        <View style={{ marginTop: 30 }}>
          <Button
            title="Sign Out"
            onPress={async () => {
              await setTokens({ accessToken: "", refreshToken: "" });
              setUserInfo(null);
              navigation.navigate("Login");
            }}
          />
        </View>
      ) : (
        <Button
          title="Login"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    marginLeft: 30,
    marginBottom: 30,
  },
  userInfo: {
    fontSize: 20,
    marginLeft: 30,
  },
  signOutButton: {},
});
