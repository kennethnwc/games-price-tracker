import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { Item } from "../components/Item";
import { API_URL } from "../constants";
import { ThemeText } from "../ui/ThemeText";

export const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] =
    useState<{
      lastUpdated: string;
      games: any[];
    }>();

  useEffect(() => {
    fetch(API_URL + "/games_on_sale")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator size="small"></ActivityIndicator>
      ) : (
        <View>
          <ThemeText style={{ marginBottom: 10 }}>
            Last Updated {data?.lastUpdated.split("T")[0]}
          </ThemeText>
          <FlatList
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            style={{ marginBottom: 20 }}
            data={data?.games}
            keyExtractor={({ store_id }) => store_id}
            renderItem={renderItem}
            removeClippedSubviews={true}
          />
        </View>
      )}
    </View>
  );
};

const renderItem = ({ item }: { item: any }) => (
  <Item key={item.id} item={item}></Item>
);
