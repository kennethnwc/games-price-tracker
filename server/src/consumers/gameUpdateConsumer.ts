import amqp from "amqplib/callback_api";
import { Game } from "../entity/game";
import { Price } from "../entity/price";
import { getGameWithPrices } from "../query/getGameWithLastPrice";

export const gameUpdateConsumer = async (msg: amqp.Message | null) => {
  if (!msg) {
    console.log("game_update no msg");
  } else {
    const result = JSON.parse(msg.content.toString());
    const game = result.game;
    const lastUpdate = result.lastUpdate;

    const gameRecord = await getGameWithPrices(game.store_id);
    if (gameRecord) {
      const prices = gameRecord.prices;
      const lastPrice = prices[prices.length - 1];
      const updatePriceAmount = game.price.amount;
      if (!lastPrice || updatePriceAmount != lastPrice.amount) {
        const newPrice = await Price.create({
          code: game.price.currency,
          amount: updatePriceAmount,
          start_date: lastUpdate,
          game: gameRecord,
        }).save();
        console.log(newPrice);
      } else {
        // console.log("same price");
      }
    }
    if (!gameRecord) {
      const price = game.price;

      const newPrice = await Price.create({
        code: price.currency,
        amount: price.amount,
        start_date: lastUpdate,
      }).save();

      const newGame = await Game.create({
        title: game.title,
        store_id: game.store_id,
        prices: [newPrice],
      }).save();

      console.log(newGame, "inserted");
    }
  }
};
