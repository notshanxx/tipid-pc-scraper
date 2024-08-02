import express from "express";

import { fetchData, extractData } from "./niggascrape/getItems.js";

const app = express();

app.get("/api", async (req, res) => {
  const queryPage = parseInt(req.query.page || 1);

  try {
    const html = await fetchData(queryPage);
    const items = extractData(html);
    res.send(items);
  } catch (error) {
    console.error("Error scraping data:", error);
    res.status(500).send("Error scraping data" + error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("running");
});
