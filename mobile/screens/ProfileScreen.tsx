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
import { getDataWithAuth } from "../utils/getDataWithAuth";
import { Layout } from "./Layout";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserStackNavigatorParam } from "../navigation/StackNavigator";
import { REDIRECT_TO_LOGIN_SCREEN } from "../utils/constants";

export type ProfileScreenParam = {
  Profile: { accessToken: string };
};

export const ProfileScreen = () => {
  const { accessToken, setTokens, refreshToken } = useTokenStore();
  const navigation =
    useNavigation<StackNavigationProp<UserStackNavigatorParam>>();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();

    getDataWithAuth(
      API_URL + "/user/profile",
      accessToken || "",
      refreshToken || ""
    )
      .then(async (r) => {
        const { data, accessToken } = r!;
        setUserInfo({ ...data });
        await setTokens({
          accessToken: accessToken,
          refreshToken: refreshToken!,
        });
      })
      .catch(async (err) => {
        if (err.message === REDIRECT_TO_LOGIN_SCREEN) {
          await setTokens({ accessToken: "", refreshToken: "" });
        }
        navigation.replace("Login");
      });
    setLoading(false);
    return () => {
      ac.abort();
    };
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
              navigation.replace("Login");
            }}
          />
        </View>
      ) : (
        <Button
          title="Login"
          onPress={() => {
            navigation.replace("Login");
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
