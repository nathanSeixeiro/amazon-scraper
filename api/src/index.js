import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express()
const port = 3000

app.use(express.json())

app.get('/', async (req, res) => {
    const {keyword} = req.query
    const url = `https://www.lojasrenner.com.br/b?Ntt=${keyword}`
// https://www.casasbahia.com.br/
    const {data} = await axios.get(url)
    const $ = cheerio.load(data)

    const products = [];

    $('.s-result-item').each((index, element) => {
        const title = $(element).find('.ProductBox_title__x9UGh').text();
        products.push({ title });
    });
    
    console.log(products)
})

app.listen(port, () => console.log(`✔ server is running on port: ${port}`))