import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView } from "react-native";

import { RouteProp, useRoute } from "@react-navigation/native";

import { PriceHisotryChart } from "../components/PriceHistoryChart";
import { API_URL } from "../constants";
import { DetailsItemListStackNavigatorParams } from "../navigation/StackNavigator";
import { Layout } from "../ui/Layout";
import { ThemeText } from "../ui/ThemeText";

export type Price = {
  amount: number;
  code: string;
  id: number;
  start_date: string;
};

export const DetailScreen: React.FC = ({}) => {
  const route =
    useRoute<RouteProp<DetailsItemListStackNavigatorParams, "Detail">>();

  const { store_id, title, image_url } = route.params;
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(false);
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
      <ScrollView style={{ flex: 1 }}>
        <Image
          source={
            image_url ? { uri: image_url } : require("../assets/default.jpg")
          }
          resizeMode="cover"
          style={{ width: "100%", height: 200 }}
          borderRadius={5}
        />
        <ThemeText style={{ fontWeight: "bold" }}>{title}</ThemeText>
      </ScrollView>
    </Layout>
  );
};
