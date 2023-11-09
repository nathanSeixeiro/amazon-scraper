import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;
  const url = `https://www.amazon.com/s?k=${keyword}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const products = [];

    $('.s-result-item').each((index, element) => {
      const title = $(element).find('span.a-text-normal').text();
      const rating = $(element).find('span.a-icon-star').attr('aria-label');
      const numReviews = $(element).find('span.a-size-base').text();
      const imgURL = $(element).find('img.s-image').attr('src');

      products.push({ title, rating, numReviews, imgURL });
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape data.' });
  }
});

app.listen(port, () => console.log(`✔ server is running on port: ${port}`));