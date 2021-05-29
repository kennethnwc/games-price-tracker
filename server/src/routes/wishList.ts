import { Router } from "express";
import { getRepository } from "typeorm";

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
    return res.json({ error: err.message, userID: userID });
  }
});

// wishListRouter.post("/", authMiddleware, async (req, res) => {
//   const googleID = req.user?.googleID;
//   if (!googleID) {
//     return res.json();
//   }
//   const store_id = req.body.store_id;
//   if (!store_id) {
//     return res.json();
//   }
// });
