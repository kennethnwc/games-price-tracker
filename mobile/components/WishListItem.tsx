import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { WishList } from "../types/response";
import { ThemeText } from "../ui/ThemeText";

type Props = { item: WishList };

export const WishListItem: React.FC<Props> = ({ item }) => {
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
          {item.prices[0].code} {item.prices[0].amount}
        </ThemeText>
      </View>
    </TouchableOpacity>
  );
};
