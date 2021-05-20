import puppeteer from "puppeteer";
import schedule from "node-schedule";
import fs from "fs";

const getSales = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://store.nintendo.com.hk/games/sale");
  const productsOnSale = await page.evaluate(() => {
    const allProduct = Array.from(
      document.querySelectorAll(".category-product-item")
    );
    return allProduct.map((product) => {
      const priceString = product.querySelector(".price")?.textContent;
      const [currency, amount] = priceString?.split(" ") || "HKD 0";
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
      };
    });
  });

  fs.writeFileSync(
    "../temp_result/productsOnSale.json",
    JSON.stringify({
      products_on_sale: productsOnSale,
      lastUpdated: Date.now(),
    }),
    "utf8"
  );

  await browser.close();
};

// schedule.scheduleJob("* 50 * * * *", () => {
//   console.log("get sale");
//   getSales();
// });

getSales();
