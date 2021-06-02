import { Router } from "express";
import { getRepository } from "typeorm";

import { Game } from "../entity/game";
import { User } from "../entity/user";
import { WishList } from "../entity/whislist";
import { authMiddleware } from "../middleware/auth";
import { getGameWithLastPrice } from "../query/getGameWithLastPrice";

export const wishListRouter = Router();

wishListRouter.get("/", authMiddleware, async (req, res) => {
  const userID = req.user?.userID;
  try {
    const wishListRepository = getRepository(WishList);

    const wishListRaw = await wishListRepository
      .createQueryBuilder("wish_list")
      .where("wish_list.user_id = :id AND wish_list.is_present = true", {
        id: userID,
      })
      .getRawMany<{
        wish_list_id: number;
        wish_list_is_present: boolean;
        wish_list_game_id: number;
        wish_list_user_id: number;
      }>();

    const result = await Promise.all(
      wishListRaw.map(async (item) => {
        if (!item) {
          return {};
        }
        const gameWithLastPrice = await getGameWithLastPrice({
          game_id: item.wish_list_game_id,
        });
        return gameWithLastPrice;
      })
    );

    return res.json({ wishList: result, userID: userID });
  } catch (err) {
    console.log(err);
    return res.json({ error: err.message, userID: userID });
  }
});

wishListRouter.post("/", authMiddleware, async (req, res) => {
  const googleID = req.user?.googleID;
  if (!googleID) {
    return res.json({ message: "do not have a googleID" });
  }
  const store_id = req.body.store_id;
  if (!store_id) {
    return res.json({ message: "cannot get store_id from body" });
  }

  const user = await User.findOne({ googleID: googleID });
  if (!user) {
    return res.json({ message: "no user found" });
  }
  const game = await Game.findOne({ store_id: store_id });
  if (!game) {
    return res.json({ message: "no game found" });
  }

  const wishList = await WishList.findOne({ user: user, game: game });
  if (wishList) {
    wishList.is_present = !wishList.is_present;
    await wishList.save();
    return res.json({ message: "success" });
  }

  const newWishList = WishList.create({ user: user, game: game });
  await newWishList.save();
  return res.json({ message: "success" });
});
