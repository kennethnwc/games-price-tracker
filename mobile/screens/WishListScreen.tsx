import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useTokenStore } from "../store/useTokenStore";
import { ThemeText } from "../ui/ThemeText";

export const WishListScreen = () => {
  const { accessToken, refreshToken } = useTokenStore();
  return (
    <View style={styles.container}>
      <ThemeText>Wish List</ThemeText>
      <Button
        title="Test"
        onPress={() => {
          console.log({ accessToken, refreshToken });
        }}
      />
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
