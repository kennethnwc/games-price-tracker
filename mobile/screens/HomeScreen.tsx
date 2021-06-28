import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";

import { Item } from "../components/Item";
import { API_URL } from "../constants";
import { Layout } from "../ui/Layout";
import { ThemeText } from "../ui/ThemeText";

type Props = {};

export const HomeScreen: React.FC<Props> = () => {
  const [isLoading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
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
  }, [refresh]);

  return (
    <Layout>
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemeText style={{ marginBottom: 10 }}>
                Last Updated {data?.lastUpdated.split("T")[0]}
              </ThemeText>
              <TouchableOpacity
                onPress={() => {
                  setRefresh((prev) => !prev);
                }}
              >
                <Icon name="refresh" size={30} color="#ffffff" />
              </TouchableOpacity>
            </View>
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
    </Layout>
  );
};

const renderItem = ({ item }: { item: any }) => (
  <Item key={item.id} item={item}></Item>
);
