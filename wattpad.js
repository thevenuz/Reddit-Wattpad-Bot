const axios= require("axios");
const cheerio = require("cheerio");

const headers= {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'};
const domain = "https://www.wattpad.com/search/";

axios.get(domain, {
    headers: headers
})
.then((res) => {
    const htmldata= res.data;
    const $ = cheerio.load(htmldata);

    const values= $('.story-card-container .list-group-item').each((index, element) => {
        const URL= $(element).children('a').attr('href');
        const title= $(element).children('.story-card').children('.story-card-data').children('.top-section').children('.story-info').children('.title').text();
        console.log(title)
        console.log(URL)
    });
})
.catch((err) => {
    console.log(err);
});

scrape();


