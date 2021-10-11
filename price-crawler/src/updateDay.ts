import amqp from "amqplib/callback_api";
import fs from "fs";
import { resolve } from "path";

import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env") });
console.log("path", resolve(__dirname, "../.env"));
console.log(`Rabbitmq host is ${process.env.RABBITMQ_HOST}`);

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("no file to read");
  process.exit(1);
}

const filename = args[0];
const raw = fs.readFileSync(resolve(__dirname, "../" + filename));
const json = JSON.parse(raw.toString());
// console.log({ json });
if (process.env.RABBITMQ_HOST)
  amqp.connect(process.env.RABBITMQ_HOST, (error0, rabbitmq) => {
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

      let games = json.games;
      let lastUpdate = json.lastUpdate;
      games.forEach(async (game: any) => {
        channel.sendToQueue(
          "game_update",
          Buffer.from(JSON.stringify({ game, lastUpdate: lastUpdate }))
        );
      });
    });
  });
