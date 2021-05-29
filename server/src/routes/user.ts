import { Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../entity/user";
import { authMiddleware } from "../middleware/auth";
import { googleAuthMiddle } from "../middleware/googleAuth";
import { UserInRequest } from "../typings";
import { getAccessToken, getRefreshToken } from "../utils";

export const userRouter = Router();

userRouter.get("/login", googleAuthMiddle, async (req, res) => {
  const data = req.googleVerifyResponse;
  if (data) {
    const userRecord = await User.findOne({ googleID: data.sub });
    if (!userRecord) {
      // no user record in database
      const newUser = await User.create({
        email: data.email,
        googleID: data.sub,
      }).save();
      const user = {
        userID: newUser.id,
        email: newUser.email,
        googleID: newUser.googleID,
      };
      const accessToken = getAccessToken(user);
      const refreshToken = getRefreshToken(user);
      return res.json({ accessToken, refreshToken });
    } else {
      // userRecord in database
      const user = {
        email: userRecord.email,
        googleID: userRecord.googleID,
        userID: userRecord.id,
      };
      const refreshToken = getRefreshToken(user);
      const accessToken = getAccessToken(user);
      return res.json({ accessToken, refreshToken });
    }
  }
  return res.sendStatus(403).json({});
});

userRouter.get("/profile", authMiddleware, async (req, res) => {
  res.json(req.user);
});

userRouter.post("/token", async (req, res) => {
  const refreshToken: string = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    const u = user as UserInRequest;
    const accessToken = getAccessToken({
      email: u.email,
      googleID: u.googleID,
      userID: u.userID,
    });
    res.json({ accessToken: accessToken });
    return;
  });
  return;
});
