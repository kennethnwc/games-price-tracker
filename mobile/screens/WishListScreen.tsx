import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { Item } from "../components/Item";
import { API_URL } from "../constants";
import { useTokenStore } from "../store/useTokenStore";
import { WishListResponse } from "../types/response";
import { ThemeText } from "../ui/ThemeText";
import { getDataWithAuth } from "../utils/getDataWithAuth";

export const WishListScreen = () => {
  const { accessToken, refreshToken, setTokens } = useTokenStore();
  const [isLoading, setLoading] = useState(false);
  const [wishListResponse, setWishListResponse] = useState<WishListResponse>();
  useEffect(() => {
    setLoading(true);
    getDataWithAuth(
      API_URL + "/wish_list",
      accessToken || "",
      refreshToken || ""
    ).then(async (r) => {
      const { data, accessToken } = r!;
      console.log(data);
      const wishList = setWishListResponse({ ...data });
      console.log(wishList);
      await setTokens({
        accessToken: accessToken,
        refreshToken: refreshToken!,
      });
    });
    setLoading(false);
  }, [accessToken, refreshToken]);

  return (
    <View style={styles.container}>
      <ThemeText>Wish List</ThemeText>
      {wishListResponse && wishListResponse.wishList && (
        <FlatList
          style={{ marginBottom: 20 }}
          data={wishListResponse?.wishList}
          keyExtractor={({ store_id }) => store_id}
          renderItem={({ item }) => <Item item={item} isWishProps={true} />}
        />
      )}
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
