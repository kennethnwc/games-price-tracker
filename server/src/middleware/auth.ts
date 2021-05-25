import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserInRequest } from "../typings";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.json({});
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "access token expired" });
    }
    req.user = user as UserInRequest;
    next();
    return;
  });
  return;
};
