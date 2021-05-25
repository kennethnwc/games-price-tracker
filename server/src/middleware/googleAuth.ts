import axios from "axios";
import { NextFunction, Request, Response } from "express";

export const googleAuthMiddle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  const data = await axios
    .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    .then((res) => res.data)
    .catch(() => {});
  if (!data) return res.sendStatus(403);
  req.googleVerifyResponse = data;
  next();
  return;
};
