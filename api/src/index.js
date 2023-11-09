import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

// basic express server
const app = express();
const port = 3000;

app.use(express.json());
//use cor for allowed the frontend make a requests
app.use(cors());

app.get("/api/scrape", async (req, res) => {
    const { keyword } = req.query;
    const url = `https://www.amazon.com/s?k=${keyword}`;

    try {
        // get data from the url with axios
        const { data } = await axios.get(url);
        // load data on cheerio
        const $ = cheerio.load(data);

        const products = [];

        // get the elements what i want based on yours css selectors  
        $(".s-result-item").each((index, element) => {
            const title = $(element).find("span.a-text-normal").text();
            // const rating = $(element).find("span.a-icon-star").attr("aria-label");
            const rating = $(element).find("span.a-icon-alt").text();
            const numReviews = $(element).find("span.a-size-base").text();
            const imgURL = $(element).find("img.s-image").attr("src");

            // create an object with scraped data and add it to the 'products' array
            products.push({ title, rating, numReviews, imgURL });
        });

        res.json(products);
    } catch (error) {
        // error message
        res.status(500).json({ error: "Failed to scrape data." });
    }
});

app.listen(port, () => console.log(`✔ server is running on port: ${port}`));