import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Layout: React.FC = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};
