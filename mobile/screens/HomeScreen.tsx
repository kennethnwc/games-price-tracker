import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Item } from "../components/Item";
import { ThemeText } from "../ui/ThemeText";
import { DetailScreen } from "./DetailScreen";

const HomeStack = createStackNavigator();

export const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] =
    useState<{
      last_updated: number;
      products_on_sale: any[];
    }>();

  useEffect(() => {
    fetch("http://192.168.1.21:4000/products_on_sales")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <ThemeText style={{ marginBottom: 10 }}>Games on sale</ThemeText>
          <FlatList
            style={{ marginBottom: 20 }}
            data={data?.products_on_sale}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => <Item item={item}></Item>}
          />
        </>
      )}
    </View>
  );
};

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
    </HomeStack.Navigator>
  );
}
