const axios= require("axios");
const cheerio = require("cheerio");

try{    
    const headers= {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'};
    const searchPrefix = "https://www.wattpad.com/search/";
    const domain = "https://www.wattpad.com";
    
    const getStoryLink= async (storyTitle) => {
        const searchLink = searchPrefix + storyTitle;
        const responseData=[];

        const res = await axios.get(searchLink, {
            headers: headers
        });
        const htmldata= res.data;
        const $ = cheerio.load(htmldata);
        console.log("get story called");
        const values = $('.story-card-container .list-group-item');

        for (const value of values)
        {
            const storyURL= $(value).children('a').attr('href');
            const title= $(value).children('.story-card').children('.story-card-data').children('.story-info').children('.title').text();
            const jsonData = {
                "title": title,
                "url" : domain + storyURL
            };

            responseData.push(jsonData);
        }
        return responseData;
    }   

    module.exports = getStoryLink;
}

catch (ex){
    console.log(ex);
}




