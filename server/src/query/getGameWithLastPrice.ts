import { Game } from "../entity/game";
import { Price } from "../entity/price";

export const getGameWithPrices = async (store_id: string) => {
  const game = await Game.findOne({ store_id }, { relations: ["prices"] });
  return game;
};

type GetGameWithLastPriceParams = {
  store_id?: string;
  game_id?: number;
};
export const getGameWithLastPrice = async ({
  store_id,
  game_id,
}: GetGameWithLastPriceParams) => {
  let condition;
  if (store_id) {
    condition = { store_id: store_id };
  } else if (game_id) {
    condition = { id: game_id };
  } else {
    return undefined;
  }
  const game = await Game.findOne(condition);
  if (!game) {
    return undefined;
  }
  const prices = await Price.find({
    where: {
      game: game,
    },
    order: {
      start_date: "DESC",
    },
    take: 1,
  });
  game.prices = prices;
  return game;
};
