import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Google from "expo-google-app-auth";
import React from "react";
import { Button, View } from "react-native";
import { UserStackNavigatorParam } from "../navigation/StackNavigator";

type LoginScreenProps = {
  navigation: StackNavigationProp<UserStackNavigatorParam, "Login">;
};

const storeData = async (value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@user_info", jsonValue);
  } catch (e) {
    // saving error
  }
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const signInAsync = async () => {
    console.log("LoginScreen.js 6 | loggin in");
    try {
      const result = await Google.logInAsync({
        iosClientId: `afsa`,
        androidClientId: `dasd`,
      });

      if (result.type === "success") {
        // Then you can use the Google REST API
        await storeData(result);
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

// const styles = StyleSheet.create({});
