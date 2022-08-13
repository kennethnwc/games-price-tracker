import Constants from "expo-constants";

export const API_URL =
  Constants.expoConfig?.extra?.API_URL || "http://localhost:4000";
export const IOS_CLIENT_ID = Constants.expoConfig?.extra?.IOS_CLIENT_ID || "";
export const AN_CLIENT_ID = Constants.expoConfig?.extra?.AN_CLIENT_ID || "";
export const AN_STANDALONE_ID =
  Constants.expoConfig?.extra?.AN_STANDALONE_ID || "";
