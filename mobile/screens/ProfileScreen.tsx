import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/core";
import { RouteProp } from "@react-navigation/native";
import { GoogleUser, LogInResult } from "expo-google-app-auth";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export type ProfileScreenParam = {
  Profile: { user: GoogleUser; result: LogInResult };
};

export const ProfileScreen = () => {
  const route = useRoute<RouteProp<ProfileScreenParam, "Profile">>();
  const [userInfo, setUserInfo] = useState<LogInResult | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@user_info");
        setUserInfo(jsonValue != null ? JSON.parse(jsonValue) : null);
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, [JSON.stringify(userInfo)]);

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
            await AsyncStorage.removeItem("@user_info");
            setUserInfo(null);
          } catch (e) {
            // remove error
          }
        }}
      ></Button>
    </View>
  );
};
