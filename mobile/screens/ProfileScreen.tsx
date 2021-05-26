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

export type ProfileScreenParam = {
  Profile: { accessToken: string };
};

export const ProfileScreen = () => {
  const { accessToken, setTokens, refreshToken } = useTokenStore();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const getData = async (
      url: string,
      times: number,
      accessTokenToFetch: string
    ) => {
      // try to fetch data
      let data = await fetch(url, {
        headers: { Authorization: `Bearer ${accessTokenToFetch}` },
      })
        .then((r) => r.json())
        .catch(() => "expired");
      setUserInfo(data);
      // // if token need to be refreshed.
      if (data === "expired") {
        //   // Use variable times to prevent stack overflow.
        if (times > 0) {
          // refresh the token
          const newToken = await fetch(API_URL + "/user/token", {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ token: refreshToken }),
          })
            .then((r) => r.json())
            .then((r) => r.accessToken);
          // try again
          let data = await fetch(url, {
            headers: { Authorization: `Bearer ${newToken}` },
          })
            .then((r) => r.json())
            .catch(() => "expired");
          setUserInfo(data);
          return newToken;
        } else {
          throw new Error("The appropriate error message");
        }
      }

      return accessToken;
    };

    getData(API_URL + "/user/profile", 3, accessToken || "").then(async (r) => {
      await setTokens({ accessToken: r, refreshToken: refreshToken! });
    });

    setLoading(false);
  }, [accessToken]);

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
