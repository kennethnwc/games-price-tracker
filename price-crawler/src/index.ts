import amqp from "amqplib/callback_api";
import dotenv from "dotenv";
import schedule from "node-schedule";
import puppeteer from "puppeteer";

import {
  getHongKongTimeISOString,
  RABBITMQ_HOST,
  scheduleInterval,
} from "./config";

dotenv.config();

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getSales = async (p: string) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  await page.goto(
    `https://store.nintendo.com.hk/games/all-released-games?p=${p}`,
    {
      waitUntil: "networkidle0",
    }
  );

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: bodyWidth, height: bodyHeight });

  await page.waitForTimeout(1000);

  const games = await page.evaluate(() => {
    const allProduct = Array.from(
      document.querySelectorAll(".category-product-item")
    );
    return allProduct.map((product) => {
      const currPriceString = product.querySelector(".price")?.textContent;
      const oldPriceString =
        product.querySelector(".old-price .price")?.textContent;
      const [currency, amount] = currPriceString?.split(" ") || "HKD 0";
      const productHref = product
        .querySelector(".category-product-item-title-link")
        ?.getAttribute("href");
      const id = productHref?.substring(productHref.lastIndexOf("/") + 1);
      const img =
        product.querySelector<HTMLImageElement>(
          ".category-product-item-img img"
        )?.src || "";
      return {
        title: product
          .querySelector(".category-product-item-title-link")
          ?.textContent?.replace(/\s+/g, " ")
          .trim(),
        price: { currency, amount: parseFloat(amount) },
        store_id: id,
        discount: oldPriceString !== undefined,
        image_url: img && img.startsWith("https://") ? img : "",
      };
    });
  });

  await browser.close();
  return games;
};

amqp.connect(RABBITMQ_HOST, (error0, rabbitmq) => {
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

    console.log("crontab", scheduleInterval);

    schedule.scheduleJob(scheduleInterval, async () => {
      let allGames: ValueType<ReturnType<typeof getSales>> = [];
      console.log("get games");
      for (let i = 1; i < 40; i++) {
        const games = await getSales(i.toString());
        if (games.length === 0) {
          break;
        }
        allGames = allGames.concat(games);
        games.forEach((game) => {
          channel.sendToQueue(
            "game_update",
            Buffer.from(
              JSON.stringify({ game, lastUpdate: getHongKongTimeISOString() })
            )
          );
        });
        await delay(500);
      }

      channel.sendToQueue(
        "games_update",
        Buffer.from(
          JSON.stringify({
            games: allGames,
            lastUpdate: getHongKongTimeISOString(),
          })
        )
      );
    });
  });
});

export type ValueType<T> = T extends Promise<infer U> ? U : T;
