import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Item } from "../components/Item";
import { ThemeText } from "../ui/ThemeText";

export const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] =
    useState<{
      lastUpdated: string;
      games: any[];
    }>();

  useEffect(() => {
    fetch("http://192.168.1.21:4000/games_on_sale")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
  const memoizedValue = useMemo(
    () =>
      ({ item }: { item: any }) =>
        <Item item={item}></Item>,
    [data?.games]
  );

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <ThemeText style={{ marginBottom: 10 }}>
            Last Updated {data?.lastUpdated.split("T")[0]}
          </ThemeText>
          <FlatList
            style={{ marginBottom: 20 }}
            data={data?.games}
            keyExtractor={({ store_id }) => store_id}
            renderItem={memoizedValue}
          />
        </>
      )}
    </View>
  );
};
