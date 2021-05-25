import Constants from "expo-constants";

export const API_URL =
  Constants.manifest.extra?.API_URL || "http://localhost:4000";

export const IOS_CLIENT_ID = Constants.manifest.extra?.IOS_CLIENT_ID || "";
export const AN_CLIENT_ID = Constants.manifest.extra?.AN_CLIENT_ID || "";
