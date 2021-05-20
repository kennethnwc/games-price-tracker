import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, TextProps } from "react-native";

export const ThemeText: React.FC<TextProps> = ({ children, ...props }) => {
  const { colors } = useTheme();
  return (
    <Text style={{ color: colors.text }} {...props}>
      {children}
    </Text>
  );
};
