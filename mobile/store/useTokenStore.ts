import create from "zustand";
import { combine } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

const accessTokenKey = "@gpt/token";
const refreshTokenKey = "@gpt/refresh-token";

export const useTokenStore = create(
  combine(
    {
      accessToken: "",
      refreshToken: "",
    },
    (set) => ({
      setTokens: async (x: { accessToken: string; refreshToken: string }) => {
        try {
          await SecureStore.setItemAsync(accessTokenKey, x.accessToken);
          await SecureStore.setItemAsync(refreshTokenKey, x.refreshToken);
        } catch {}

        set(x);
      },
      loadTokens: async () => {
        try {
          let accessToken = await SecureStore.getItemAsync(accessTokenKey);
          accessToken = accessToken || "";
          let refreshToken = await SecureStore.getItemAsync(refreshTokenKey);
          refreshToken = refreshToken || "";
          set({ accessToken, refreshToken });
        } catch {}
      },
    })
  )
);
