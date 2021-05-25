import axios from "axios";
import { Router } from "express";
import jwt from "jsonwebtoken";

import { User } from "../entity/user";

export const userRouter = Router();

userRouter.get("/login", async (req, res) => {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    console.log("google id token", bearerToken);
    const data = await axios
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${bearerToken}`)
      .then((res) => res.data)
      .catch(() => {});
    // successful google check
    if (data) {
      console.log(data);
      const userRecord = await User.findOne({ googleID: data.sub });
      if (!userRecord) {
        // no user record in database
        const newUser = await User.create({
          email: data.email,
          googleID: data.sub,
        }).save();
        const accessToken = jwt.sign(
          { email: newUser.email, googleID: newUser.googleID },
          process.env.JWT_SECRET!
        );
        return res.json({ accessToken });
      } else {
        // userRecord in database
        const accessToken = jwt.sign(
          { email: userRecord.email, googleID: userRecord.googleID },
          process.env.JWT_SECRET!
        );
        return res.json({ accessToken });
      }
    }
  }
  // Fail to login
  return res.json({ error: "Please login again" });
});

userRouter.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  console.log(token);
  if (typeof token === undefined) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token!, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user as { googleID: string; email: string };
      console.log(user);
      return res.json(user);
    });
  }
  // return res.sendStatus(403);
});
