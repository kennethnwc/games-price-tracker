import React from "react";
import { View } from "react-native";

export const Layout: React.FC = ({ children }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#2c2a32" }}>{children}</View>
  );
};
