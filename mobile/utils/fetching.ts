import axios from "axios";
import { API_URL } from "../constants";

export const initAxios = (store: any) => {
  axios.interceptors.request.use(
    async function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response) {
        // server responded status code falls out of the range of 2xx
        switch (error.response.status) {
          case 400:
            break;

          case 401:
            {
              console.log("interpotrt", 401);
              console.log(store);
              // 當不是 refresh token 作業發生 401 才需要更新 access token 並重發
              // 如果是就略過此刷新 access token 作業，直接不處理(因為 catch 已經攔截處理更新失敗的情況了)
              const refreshTokeUrl = `${API_URL}/user/token`;
              if (error.config.url !== refreshTokeUrl) {
                // 原始 request 資訊
                const originalRequest = error.config;

                // 依據 refresh_token 刷新 access_token 並重發 request
                return axios
                  .post(refreshTokeUrl, { token: store.refreshToken }) // refresh_toke is attached in cookie
                  .then((response) => {
                    // [更新 access_token 成功]

                    // 刷新 storage (其他呼叫 api 的地方都會從此處取得新 access_token)
                    store.setTokens({
                      refreshToken: store.refreshToken,
                      accessToken: response.data.token,
                    });

                    // 刷新原始 request 的 access_token
                    originalRequest.headers.Authorization =
                      "Bearer " + response.data.accessToken;

                    // 重送 request (with new access_token)
                    return axios(originalRequest);
                  })
                  .catch((err) => {
                    // [更新 access_token 失敗] ( e.g. refresh_token 過期無效)
                    store.setTokens({ accessToken: "", refreshToken: "" });
                    return Promise.reject(error);
                  });
              }
            }

            break;

          case 404:
            break;

          case 500:
            break;

          default:
            break;
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        if (
          error.code === "ECONNABORTED" &&
          error.message &&
          error.message.indexOf("timeout") !== -1
        ) {
          // request time out will be here
        } else {
          // shutdonw api server
        }
      }

      return Promise.reject(error);
    }
  );
};
