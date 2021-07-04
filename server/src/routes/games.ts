import { Router } from "express";
import {
  getGameWithLastPrice,
  getGameWithPrices,
} from "../query/getGameWithLastPrice";
import { getConnection, ILike } from "typeorm";
import { Game } from "../entity/game";

export const gameRouter = Router();

gameRouter.get("/", async (_req, res) => {
  try {
    const games = await getConnection()
      .createQueryBuilder(Game, "games")
      .leftJoinAndSelect("games.prices", "prices")
      .orderBy("prices.start_date", "DESC")
      .getMany();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

gameRouter.get("/game/:store_id/prices", async (req, res) => {
  try {
    const { store_id } = req.params;
    const prices = await getGameWithPrices(store_id);
    res.status(200).json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

gameRouter.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.json({ error: "please enter title" });
  }
  const games = await Game.find({ title: ILike(`%${q}%`) });
  if (games) {
    const results = await Promise.all(
      games.map(async ({ store_id }) => {
        return await getGameWithLastPrice({ store_id });
      })
    );
    return res.json(results);
  }
  return res.json([]);
});
