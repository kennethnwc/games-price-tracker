import amqp from "amqplib/callback_api";

import { Game } from "../entity/game";
import { Price } from "../entity/price";
import { getGameWithLastPrice } from "../query/getGameWithLastPrice";

export const gameUpdateConsumer = async (
  msg: amqp.Message | null,
  channel?: amqp.Channel
) => {
  if (!msg) {
    console.log("game_update no msg");
  } else {
    const result = JSON.parse(msg.content.toString());
    const game = result.game;
    const lastUpdate = result.lastUpdate;
    let gameRecord = await getGameWithLastPrice({ store_id: game.store_id });
    if (gameRecord) {
      const prices = gameRecord.prices;
      const lastPrice = prices[prices.length - 1];
      const updatePriceAmount = game.price.amount;
      if (!lastPrice || updatePriceAmount != lastPrice.amount) {
        await Price.create({
          code: game.price.currency,
          amount: updatePriceAmount,
          start_date: lastUpdate,
          game: gameRecord,
        }).save();
      }
      const gameAfterPriceUpdated = await Game.findOne({
        store_id: game.store_id,
      });
      if (
        gameAfterPriceUpdated &&
        !gameAfterPriceUpdated.image_url &&
        game.image_url &&
        (game.image_url as string).startsWith("https://")
      ) {
        gameAfterPriceUpdated.image_url = game.image_url;
        await gameAfterPriceUpdated.save();
      }
    } else if (!gameRecord) {
      const price = game.price;

      const newPrice = await Price.create({
        code: price.currency,
        amount: price.amount,
        start_date: lastUpdate,
      }).save();

      await Game.create({
        title: game.title,
        store_id: game.store_id,
        prices: [newPrice],
        image_url:
          game.image_url && game.image_url.startsWith("http")
            ? game.image_url
            : null,
      }).save();
    }
    channel?.ack(msg);
  }
};
