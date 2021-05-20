import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import { ParamList } from ".";

export const DetailScreen: React.FC = ({}) => {
  const route = useRoute<RouteProp<ParamList, "Detail">>();

  const { id } = route.params;
  return (
    <View>
      <Text>Detail Screen for id {id}</Text>
    </View>
  );
};
