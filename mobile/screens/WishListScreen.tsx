import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";

import { Item } from "../components/Item";
import { API_URL } from "../constants";
import { useTokenStore } from "../store/useTokenStore";
import { useWishListSetStore } from "../store/useWishListSetStore";
import { WishListResponse } from "../types/response";
import { Layout } from "../ui/Layout";
import { ThemeText } from "../ui/ThemeText";
import { getDataWithAuth } from "../utils/getDataWithAuth";

export const WishListScreen = () => {
  const { accessToken, refreshToken, setTokens } = useTokenStore();
  const [isLoading, setLoading] = useState(false);
  const [wishListResponse, setWishListResponse] = useState<WishListResponse>();
  const { setWishListSet } = useWishListSetStore();
  const [refresh, setRefresh] = useState(true);
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
  }, [refresh, accessToken]);

  return (
    <Layout>
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading && <ActivityIndicator size="large" color="white" />}

        {wishListResponse && wishListResponse.wishList ? (
          <View>
            <View style={{ flexDirection: "row-reverse", paddingBottom: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setRefresh((prev) => !prev);
                }}
              >
                <Icon name="refresh" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <FlatList
              style={{ marginBottom: 20 }}
              data={wishListResponse?.wishList}
              keyExtractor={({ store_id }) => store_id}
              renderItem={memoizedValue}
            />
          </View>
        ) : (
          <ThemeText>Please Login to view wish list</ThemeText>
        )}
      </View>
    </Layout>
  );
};
