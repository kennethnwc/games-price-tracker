import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Game } from "./entity/game";
import amqp from "amqplib/callback_api";

const PORT = process.env.PORT || 4000;

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
            const _ = JSON.parse(msg.content.toString());

            console.log("updatedGames");
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
            const updatedGame = JSON.parse(msg.content.toString());

            console.log(updatedGame);
          }
        },
        { noAck: true }
      );

      app.get("/games_on_sale", async (_req, _res) => {});

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
          const game = await Game.findOne(
            { store_id },
            { relations: ["prices"] }
          );
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
