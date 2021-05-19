import express from "express";
import cors from "cors";
import fs from "fs";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/products_on_sales", async (_, res) => {
  try {
    const rawData = fs.readFileSync("../temp_result/productsOnSale.json", {
      encoding: "utf8",
    });
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`listend on PORT ${PORT}`);
});
