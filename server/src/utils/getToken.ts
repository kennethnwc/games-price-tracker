import jwt from "jsonwebtoken";
import { UserInRequest } from "../typings";

export const getAccessToken = (user: UserInRequest) => {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "10s" });
};

export const getRefreshToken = (user: UserInRequest) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
