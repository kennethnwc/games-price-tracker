import { API_URL } from "../constants";
import { REDIRECT_TO_LOGIN_SCREEN } from "./constants";

export const getDataWithAuth = async (
  url: string,
  accessToken: string,
  refreshToken: string,
  config?: RequestInit
) => {
  let accessTokenToFetch = accessToken;
  let retryCounter = 3;
  while (retryCounter > 0) {
    const data = await fetch(url, {
      method: "GET",
      ...config,
      headers: {
        Authorization: `Bearer ${accessTokenToFetch}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => {
        return r.json();
      })
      .catch(() => {
        throw Error(REDIRECT_TO_LOGIN_SCREEN);
      });
    if (
      data === "access token expired" ||
      ("error" in data && data.error === "token expired")
    ) {
      retryCounter--;
      const newAccess = await fetch(API_URL + "/user/token", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })
        .then((r) => r.json())
        .catch(() => {
          throw Error(REDIRECT_TO_LOGIN_SCREEN);
        });
      if (newAccess && newAccess.accessToken) {
        accessTokenToFetch = newAccess.accessToken;
        accessToken = newAccess.accessToken;
      } else {
        throw Error(REDIRECT_TO_LOGIN_SCREEN);
      }
    } else {
      return { data, accessToken };
    }
  }
};
