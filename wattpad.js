const axios= require("axios");
const cheerio = require("cheerio");

const headers= {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'};
const domain = "https://www.wattpad.com/search/";

async function scrape(){
    const response = await axios.get(domain, {
        headers: headers
    });
    console.log(response);
}

scrape();


