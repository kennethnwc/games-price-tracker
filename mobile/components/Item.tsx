import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { ThemeText } from "../ui/ThemeText";

export const Item: React.FC<{
  item: {
    store_id: string;
    image_url: string;
    title: string;
    price: { currency: string; amount: number };
  };
}> = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginBottom: 10 }}
      onPress={(e) => {
        navigation.navigate("Detail", { id: item.store_id });
      }}
    >
      <View>
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require("../assets/default.jpg")
          }
          resizeMode="cover"
          style={{ width: "100%", height: 200 }}
          borderRadius={5}
        ></Image>
        <ThemeText>{item.title}</ThemeText>
        <ThemeText>
          {item.price.currency} {item.price.amount}
        </ThemeText>
      </View>
    </TouchableOpacity>
  );
};
