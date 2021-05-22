import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Game } from "./entity/game";
import amqp from "amqplib/callback_api";
import { Price } from "./entity/price";
import { getGameWithPrices } from "./query/getGameWithLastPrice";
import fs from "fs";

const PORT = process.env.PORT || 4000;

let games_on_sale = JSON.parse(
  fs.readFileSync("./games_on_sales.json", {
    encoding: "utf8",
    flag: "r",
  })
);

createConnection().then(async (db) => {
  amqp.connect("amqp://localhost", (error0, rabbitmq) => {
    if (error0) {
      throw error0;
    }
    rabbitmq.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue("games_update", {
        durable: false,
      });
      channel.assertQueue("game_update", {
        durable: false,
      });

      const app = express();

      app.use(cors());
      app.use(express.json());

      channel.consume(
        "games_update",
        async (msg) => {
          if (!msg) {
            console.log("product_created no msg");
          } else {
            try {
              const result = JSON.parse(msg.content.toString());
              const newGamesOnSale = result.games.filter(
                (game: any) => game.discount === true
              );
              const newLastUpdated = result.lastUpdate;
              const newGamesOnSaleResult = {
                games: newGamesOnSale,
                lastUpdated: newLastUpdated,
              };
              fs.writeFileSync(
                "./games_on_sales.json",
                JSON.stringify(newGamesOnSaleResult),
                "utf8"
              );
              games_on_sale = newGamesOnSaleResult;
            } catch (err) {
              console.log(err);
            }
          }
        },
        { noAck: true }
      );

      channel.consume(
        "game_update",
        async (msg) => {
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
              if (updatePriceAmount != lastPrice.amount) {
                const newPrice = await Price.create({
                  code: lastPrice.code,
                  amount: updatePriceAmount,
                  start_date: lastUpdate,
                  game: gameRecord,
                }).save();
                console.log(newPrice);
              } else {
                console.log("same price");
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
        },
        { noAck: true }
      );

      app.get("/games_on_sale", async (_req, res) => {
        if (!games_on_sale) {
          res.status(500).json({ message: "fail" });
        } else {
          res.status(200).json(games_on_sale);
        }
      });

      app.get("/test", async (_req, res) => {
        const a = await Game.findOne({ store_id: "fd" });
        console.log(a);
        res.json(a);
      });

      app.get("/games", async (_req, res) => {
        try {
          const games = await db
            .createQueryBuilder(Game, "games")
            .leftJoinAndSelect("games.prices", "prices")
            .orderBy("prices.start_date", "DESC")
            .getMany();
          res.status(200).json(games);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

      app.get("/game/:store_id", async (req, res) => {
        try {
          const { store_id } = req.params;
          const game = await getGameWithPrices(store_id);
          res.status(200).json(game);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

      app.listen(PORT, () => {
        console.log(`listend on PORT ${PORT}`);
        process.on("beforeExit", () => {
          console.log("closing");
          db.close();
        });
      });
    });
  });
});
