import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemeText } from "../ui/ThemeText";

export const WishListScreen = () => {
  return (
    <View style={styles.container}>
      <ThemeText>Wish List</ThemeText>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
