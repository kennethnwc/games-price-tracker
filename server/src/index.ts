import "reflect-metadata";

import amqp from "amqplib/callback_api";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { createConnection } from "typeorm";

import { gameUpdateConsumer } from "./consumers/gameUpdateConsumer";
import { Game } from "./entity/game";
import { Price } from "./entity/price";
import { gameRouter } from "./routes/games";
import { userRouter } from "./routes/user";
import { wishListRouter } from "./routes/wishList";

dotenv.config();

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
                "../games_on_sales.json",
                JSON.stringify(newGamesOnSaleResult),
                "utf8"
              );
              fs.writeFileSync(
                `../games_${newLastUpdated.split("T")[0]}.json`,
                JSON.stringify(result),
                "utf-8"
              );
              games_on_sale = newGamesOnSaleResult;
            } catch (err) {
              console.log(err);
            }
          }
        },
        { noAck: true }
      );

      channel.consume("game_update", gameUpdateConsumer, { noAck: true });

      app.use("/games", gameRouter);
      app.use("/user", userRouter);
      app.use("/wish_list", wishListRouter);

      app.get("/games_on_sale", async (_req, res) => {
        if (!games_on_sale) {
          res.status(500).json({ message: "fail" });
        } else {
          res.status(200).json(games_on_sale);
        }
      });

      app.get("/", async (_, res) => {
        const game = await Game.findOne({ id: 415 });
        if (!game) return res.json({});
        game.prices = await Price.find({
          where: {
            game: game,
          },
          order: {
            start_date: "DESC",
          },
          take: 1,
        });

        return res.json(game);
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
