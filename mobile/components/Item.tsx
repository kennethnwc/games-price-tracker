import React, { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

import { API_URL } from "../constants";
import { DetailsItemListStackNavigatorParams } from "../navigation/StackNavigator";
import { useTokenStore } from "../store/useTokenStore";
import { useWishListSetStore } from "../store/useWishListSetStore";
import { WishList } from "../types/response";
import { ThemeText } from "../ui/ThemeText";
import { getDataWithAuth } from "../utils/getDataWithAuth";

type Props = {
  item:
    | {
        store_id: string;
        image_url: string;
        title: string;
        price: { currency: string; amount: number };
      }
    | WishList;
  isWishProps?: boolean;
};

export const Item: React.FC<Props> = ({ item, isWishProps = false }) => {
  const { accessToken, refreshToken, setTokens } = useTokenStore();
  const { wishListSet, setWishListSet } = useWishListSetStore();
  const navigation =
    useNavigation<StackNavigationProp<DetailsItemListStackNavigatorParams>>();
  useEffect(() => {}, [wishListSet]);
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Detail", {
            title: item.title,
            store_id: item.store_id,
            image_url: item.image_url,
          });
        }}
      >
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require("../assets/default.jpg")
          }
          resizeMode="cover"
          style={{ width: "100%", height: 200 }}
          borderRadius={5}
        />
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <ThemeText style={{ fontWeight: "bold" }}>{item.title + " "}</ThemeText>
        <ThemeText>
          {"price" in item
            ? item.price.currency + " " + item.price.amount
            : "prices" in item
            ? item.prices[0].code + " " + item.prices[0].amount
            : ""}
        </ThemeText>
        <TouchableOpacity style={{ marginLeft: 10 }}>
          {accessToken && refreshToken ? (
            <Icon
              size={25}
              name="heart"
              color={wishListSet.has(item.store_id) ? "red" : "gray"}
              onPress={() => {
                getDataWithAuth(
                  API_URL + "/wish_list",
                  accessToken || "",
                  refreshToken || "",
                  {
                    method: "POST",
                    body: JSON.stringify({ store_id: item.store_id }),
                  }
                )
                  .then(async (r) => {
                    const { data, accessToken } = r!;
                    await setTokens({
                      accessToken: accessToken,
                      refreshToken: refreshToken!,
                    });
                    if (data.message === "success") {
                      setWishListSet(item.store_id);
                    }
                  })
                  .catch();
              }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};
