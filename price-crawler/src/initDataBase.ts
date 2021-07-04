import amqp from "amqplib/callback_api";
import fs from "fs";

import { RABBITMQ_HOST } from "./config";

amqp.connect(RABBITMQ_HOST, (error0, rabbitmq) => {
  if (error0) {
    throw error0;
  }

  rabbitmq.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue("game_update", {
      durable: false,
    });

    const testFolder = "../prices_history_temp";

    fs.readdirSync(testFolder).forEach(async (file) => {
      console.log(file);
      const raw = fs.readFileSync(testFolder + "/" + file);
      let json = JSON.parse(raw.toString());
      let games = json.games;
      let lastUpdate = json.lastUpdate;
      games.forEach(async (game: any) => {
        channel.sendToQueue(
          "game_update",
          Buffer.from(JSON.stringify({ game, lastUpdate: lastUpdate }))
        );
      });
      await delay(5000);
    });
  });
});

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
//   const raw = fs.readFileSync(testFolder + "/" + "games_2021-05-29.json");
//   let json = JSON.parse(raw.toString());
//   let games = json.games;
//   console.log(games);
//   games.forEach((game: any) => {
//     channel.sendToQueue(
//       "game_update",
//       Buffer.from(JSON.stringify({ game, lastUpdate: json.lastUpdate }))
//     );
//   });
