import React from "react";
import { SafeAreaView } from "react-native";

export const Layout: React.FC = ({ children }) => {
  return <SafeAreaView style={{ marginTop: 100 }}>{children}</SafeAreaView>;
};
