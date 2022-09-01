import puppeteer from "puppeteer";

// @ts-ignore
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
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

(async () => {
  for (let i = 0; i < 30; i++) {
    const games = await getSales(i.toString());
    if (games.length === 0) {
      break;
    }
    await delay(500);
  }
})();
