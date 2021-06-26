import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { Item } from "../components/Item";
import { API_URL } from "../constants";
import { useTokenStore } from "../store/useTokenStore";
import { useWishListSetStore } from "../store/useWishListSetStore";
import { WishListResponse } from "../types/response";
import { Layout } from "../ui/Layout";
import { getDataWithAuth } from "../utils/getDataWithAuth";

export const WishListScreen = () => {
  const { accessToken, refreshToken, setTokens } = useTokenStore();
  const [isLoading, setLoading] = useState(false);
  const [wishListResponse, setWishListResponse] = useState<WishListResponse>();
  const { wishListSet, setWishListSet } = useWishListSetStore();
  const memoizedValue = useMemo(
    () =>
      ({ item }: { item: any }) =>
        <Item item={item}></Item>,
    []
  );
  useEffect(() => {
    setLoading(true);
    getDataWithAuth(
      API_URL + "/wish_list",
      accessToken || "",
      refreshToken || ""
    )
      .then(async (r) => {
        const { data, accessToken } = r!;

        data.wishList.forEach(({ store_id }: any) => {
          setWishListSet(store_id, "ADD");
        });

        setWishListResponse({ ...data });
        await setTokens({
          accessToken: accessToken,
          refreshToken: refreshToken!,
        });
      })
      .catch(() => {
        setTokens({ accessToken: "", refreshToken: "" });
      });
    setLoading(false);
  }, [accessToken]);

  return (
    <Layout>
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading && <ActivityIndicator />}
        {wishListResponse && wishListResponse.wishList ? (
          <FlatList
            style={{ marginBottom: 20 }}
            data={wishListResponse?.wishList}
            keyExtractor={({ store_id }) => store_id}
            renderItem={memoizedValue}
          />
        ) : (
          <Text>Please Login to view wish list</Text>
        )}
      </View>
    </Layout>
  );
};
