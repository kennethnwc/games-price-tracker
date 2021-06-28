import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { PriceHisotryChart } from "../components/PriceHistoryChart";
import { API_URL } from "../constants";
import { DetailsItemListStackNavigatorParams } from "../navigation/StackNavigator";
import { useTokenStore } from "../store/useTokenStore";
import { useWishListSetStore } from "../store/useWishListSetStore";
import { Layout } from "../ui/Layout";
import { getDataWithAuth } from "../utils/getDataWithAuth";

export type Price = {
  amount: number;
  code: string;
  id: number;
  start_date: string;
};

export const DetailScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<DetailsItemListStackNavigatorParams, "Detail">>();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.title,
    });
  }, [navigation, route.params.title]);

  const { store_id, image_url } = route.params;
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);
  const { accessToken, refreshToken, setTokens } = useTokenStore();
  const { wishListSet, setWishListSet } = useWishListSetStore();
  useEffect(() => {
    setLoading(true);
    (async () => {
      const prices = await fetch(API_URL + `/games/game/${store_id}/prices`)
        .then((r) => r.json())
        .catch((err) => {
          console.log(err);
        });
      setPrices(prices);
    })();
    setLoading(false);
  }, []);

  return (
    <Layout>
      {loading ? (
        <ActivityIndicator />
      ) : (
        prices && prices.length > 0 && <PriceHisotryChart prices={prices} />
      )}
      <View style={{ flex: 1 }}>
        <Image
          source={
            image_url ? { uri: image_url } : require("../assets/default.jpg")
          }
          resizeMode="cover"
          style={{ width: "100%", height: 200 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <TouchableOpacity>
            {accessToken && refreshToken ? (
              <Icon
                size={25}
                name="heart"
                color={wishListSet.has(store_id) ? "red" : "gray"}
                onPress={() => {
                  getDataWithAuth(
                    API_URL + "/wish_list",
                    accessToken || "",
                    refreshToken || "",
                    {
                      method: "POST",
                      body: JSON.stringify({ store_id: store_id }),
                    }
                  )
                    .then(async (r) => {
                      const { data, accessToken } = r!;
                      await setTokens({
                        accessToken: accessToken,
                        refreshToken: refreshToken!,
                      });
                      if (data.message === "success") {
                        setWishListSet(store_id);
                      }
                    })
                    .catch();
                }}
              />
            ) : null}
          </TouchableOpacity>
          <Text
            style={{ color: "#378fed", textDecorationLine: "underline" }}
            onPress={() => {
              Linking.openURL(`https://store.nintendo.com.hk/${store_id}`);
            }}
          >
            Visit official page
          </Text>
        </View>
      </View>
    </Layout>
  );
};
