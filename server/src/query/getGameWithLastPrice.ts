import { Game } from "../entity/game";

export const getGameWithPrices = async (store_id: string) => {
  const game = await Game.findOne({ store_id }, { relations: ["prices"] });
  return game;
};
