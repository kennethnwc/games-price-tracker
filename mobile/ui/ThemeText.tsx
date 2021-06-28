import React from "react";
import { Text, TextProps } from "react-native";

export const ThemeText: React.FC<TextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <Text style={[{ color: "white" }, style]} {...props}>
      {children}
    </Text>
  );
};
