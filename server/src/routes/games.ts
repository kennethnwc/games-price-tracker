import { Router } from "express";
import { getGameWithPrices } from "../query/getGameWithLastPrice";
import { getConnection } from "typeorm";
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

gameRouter.get("/:store_id", async (req, res) => {
  try {
    const { store_id } = req.params;
    const game = await getGameWithPrices(store_id);
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
