import * as SecureStore from "expo-secure-store";
import create from "zustand";

const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";

type TokenSore = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  setTokens: (x: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  loadTokens: () => Promise<void>;
};

export const useTokenStore = create<TokenSore>((set) => ({
  accessToken: undefined,
  refreshToken: undefined,
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
}));
