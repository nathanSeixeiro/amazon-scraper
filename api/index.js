const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/api/scrape', async (req, res) => {
    const { keyword } = req.query;
    const url = `https://www.amazon.com/s?k=${keyword}`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const products = [];

    $('.s-result-item').each((index, element) => {
        const title = $(element).find('.a-link-normal.a-text-normal').text();
        const rating = $(element).find('.a-icon-alt').text();
        const reviews = $(element).find('.a-size-base').text();
        const image = $(element).find('.s-image').attr('src');

        products.push({ title, rating, reviews, image });
    });

    res.json(products);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));