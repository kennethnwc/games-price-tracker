import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { ThemeText } from "../ui/ThemeText";

export const Item: React.FC<{ item: any }> = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginBottom: 10 }}
      onPress={(e) => {
        navigation.navigate("Detail", { id: item.id });
      }}
    >
      <View>
        <Image
          source={item.image || require("../assets/default.jpg")}
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
