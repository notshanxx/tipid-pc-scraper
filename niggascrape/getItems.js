import cheerio from "cheerio";
import axios from "axios";

const BASE_URL = 'https://tipidpc.com/itemsearch.php?sec=s';

export const fetchData = async (pageNum) => {

  const result = await axios.get(`${BASE_URL}&page=${pageNum}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
    }
  }); // insert url and page
  return result.data;
};

export const extractData = (html) => {
  const $ = cheerio.load(html);
  const results = [];

  $("#item-search-results li").each((index, element) => {
    const nameElement = $(element).find(".item-name");
    const priceElement = $(element).find(".catprice h3");
    const userElement = $(element).find('a[href^="useritems.php?username="]');
    const dateMatch = $(element)
      .text()
      .match(/on \w+ \d+ \d+ \d+:\d+ [APM]+/);
    const urlElement = $(element).find(".item-name");
    const userUrlElement = $(element).find(
      'a[href^="useritems.php?username="]'
    );

    
    const product = {
        name: nameElement.length ? nameElement.text() : null,
        price: priceElement.length ? priceElement.text() : null,
        url: nameElement.length ? nameElement.attr("href") : null,
        seller: {
            name: userElement.length ? userElement.text() : null,
            url: userUrlElement.length ? userUrlElement.attr("href") : null
        }
    }
    const datePosted = dateMatch ? dateMatch[0].replace("on ", "") : null;

    // const name = nameElement.length ? nameElement.text() : null;
    // const price = priceElement.length ? priceElement.text() : null;
    // const user = userElement.length ? userElement.text() : null;
    // const url = nameElement.length ? nameElement.attr("href") : null;
    // const userUrl = userUrlElement.length ? userUrlElement.attr("href") : null;

    results.push({product, datePosted});
  });

  return results;
};
// export default {fetchData, extractData};

//   (async () => {
//     const html = await fetchData();
//     const items = extractData(html);
//     console.log(items);
//   })();
