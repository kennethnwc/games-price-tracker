import axios from "axios";
import { Router } from "express";

export const userRouter = Router();

userRouter.get("/login", async (req, res) => {
  console.log(req.headers.authorization);
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const data = await axios
      .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${bearerToken}`)
      .then((res) => res.data)
      .catch(() => {});
    if (data) {
      return res.json({ jwtToken: "" });
    }
  }
  return res.json({ error: "Please login again" });
});
