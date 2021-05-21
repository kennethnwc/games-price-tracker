import puppeteer from "puppeteer";
import schedule from "node-schedule";
import fs from "fs";
import amqp from "amqplib/callback_api";

const getSales = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://store.nintendo.com.hk/games/all-released-games");
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
      return {
        title: product
          .querySelector(".category-product-item-title-link")
          ?.textContent?.replace(/\s+/g, " ")
          .trim(),
        price: { currency, amount: parseFloat(amount) },
        id: id,
        discount: oldPriceString !== undefined,
      };
    });
  });

  fs.writeFileSync(
    "../temp_result/games.json",
    JSON.stringify({
      games: games,
      lastUpdated: new Date().toISOString(),
    }),
    "utf8"
  );

  await browser.close();
  return games;
};

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

    schedule.scheduleJob("1 * * * * *", async () => {
      console.log("get games");
      const games = await getSales();
      games.forEach((game) => {
        channel.sendToQueue("game_update", Buffer.from(JSON.stringify(game)));
      });
      channel.sendToQueue("games_update", Buffer.from(JSON.stringify(games)));
    });
  });
});
