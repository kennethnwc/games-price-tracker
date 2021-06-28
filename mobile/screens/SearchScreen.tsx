import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SearchBar } from "react-native-elements";

import { Item } from "../components/Item";
import { API_URL } from "../constants";
import { Layout } from "../ui/Layout";
import { ThemeText } from "../ui/ThemeText";

export const SearchScreen = () => {
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState([]);

  const memoizedValue = useMemo(
    () =>
      ({ item }: { item: any }) =>
        <Item item={item}></Item>,
    []
  );

  useEffect(() => {
    const fetching = async () => {
      const result = await fetch(API_URL + "/games/search?q=" + search).then(
        (r) => r.json()
      );
      setResult(result);
    };
    if (search !== "") {
      setLoading(true);
      fetching();
      setLoading(false);
    }
  }, [search]);

  return (
    <Layout>
      <SearchBar
        platform="default"
        placeholder="Search"
        onChangeText={(search) => {
          setSearchInput(search);
        }}
        value={searchInput}
        onSubmitEditing={() => {
          setSearch(searchInput);
        }}
      />
      <View style={{ flex: 1, padding: 24 }}>
        {search !== "" && result.length === 0 ? (
          <ThemeText>No results</ThemeText>
        ) : search === "" ? (
          <ThemeText>Please input</ThemeText>
        ) : (
          <></>
        )}
        {isLoading && <ActivityIndicator />}
        <FlatList
          style={{ marginBottom: 20 }}
          data={result}
          initialNumToRender={5}
          keyExtractor={({ store_id }) => store_id}
          renderItem={memoizedValue}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </Layout>
  );
};
